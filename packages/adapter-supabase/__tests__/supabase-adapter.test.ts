import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseDatabaseAdapter } from '../src';
import { type UUID, elizaLogger } from '@elizaos/core';
import { createClient } from '@supabase/supabase-js';

// Mock the elizaLogger
vi.mock('@elizaos/core', async () => {
    const actual = await vi.importActual('@elizaos/core');
    return {
        ...actual as any,
        elizaLogger: {
            error: vi.fn()
        }
    };
});

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    maybeSingle: vi.fn(() => Promise.resolve({ data: { id: 'test-room-id' }, error: null })),
                })),
            })),
        })),
    })),
}));

describe('SupabaseDatabaseAdapter', () => {
    let adapter: SupabaseDatabaseAdapter;
    const mockSupabaseUrl = 'https://test.supabase.co';
    const mockSupabaseKey = 'test-key';
    const mockSupabase = {
        from: vi.fn(() => mockSupabase),
        select: vi.fn(() => mockSupabase),
        update: vi.fn(() => mockSupabase),
        eq: vi.fn(() => mockSupabase),
        maybeSingle: vi.fn(),
        single: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        adapter = new SupabaseDatabaseAdapter(mockSupabaseUrl, mockSupabaseKey);
        // @ts-ignore - we're mocking the implementation
        adapter.supabase = mockSupabase;

        // Reset all mock implementations to return mockSupabase for chaining
        mockSupabase.from.mockReturnValue(mockSupabase);
        mockSupabase.select.mockReturnValue(mockSupabase);
        mockSupabase.update.mockReturnValue(mockSupabase);
        mockSupabase.eq.mockReturnValue(mockSupabase);
    });

    describe('getRoom', () => {
        beforeEach(() => {
            mockSupabase.eq.mockReturnValue(mockSupabase);
        });

        it('should return room ID when room exists', async () => {
            const roomId = 'test-room-id' as UUID;
            mockSupabase.maybeSingle.mockResolvedValueOnce({ 
                data: { id: roomId }, 
                error: null 
            });

            const result = await adapter.getRoom(roomId);
            
            expect(mockSupabase.from).toHaveBeenCalledWith('rooms');
            expect(mockSupabase.select).toHaveBeenCalledWith('id');
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', roomId);
            expect(result).toBe(roomId);
        });

        it('should return null when room does not exist', async () => {
            mockSupabase.maybeSingle.mockResolvedValueOnce({ 
                data: null, 
                error: null 
            });

            const roomId = 'non-existent-room' as UUID;
            const result = await adapter.getRoom(roomId);
            
            expect(result).toBeNull();
        });

        it('should return null and log error when there is a database error', async () => {
            const error = { message: 'Database error' };
            mockSupabase.maybeSingle.mockResolvedValueOnce({ 
                data: null, 
                error 
            });

            const roomId = 'error-room' as UUID;
            const result = await adapter.getRoom(roomId);
            
            expect(result).toBeNull();
            expect(elizaLogger.error).toHaveBeenCalledWith(`Error getting room: ${error.message}`);
        });
    });

    describe('getParticipantsForAccount', () => {
        const mockParticipants = [
            { id: 'participant-1', userId: 'user-1' },
            { id: 'participant-2', userId: 'user-1' }
        ];

        beforeEach(() => {
            mockSupabase.eq.mockReturnValue(mockSupabase);
        });

        it('should return participants when they exist', async () => {
            mockSupabase.eq.mockResolvedValueOnce({ 
                data: mockParticipants,
                error: null 
            });

            const userId = 'user-1' as UUID;
            const result = await adapter.getParticipantsForAccount(userId);
            
            expect(mockSupabase.from).toHaveBeenCalledWith('participants');
            expect(mockSupabase.select).toHaveBeenCalledWith('*');
            expect(mockSupabase.eq).toHaveBeenCalledWith('userId', userId);
            expect(result).toEqual(mockParticipants);
        });

        it('should throw error when database error occurs', async () => {
            const error = { message: 'Database error' };
            mockSupabase.eq.mockResolvedValueOnce({ 
                data: null,
                error
            });

            const userId = 'error-user' as UUID;
            
            await expect(adapter.getParticipantsForAccount(userId))
                .rejects
                .toThrow(`Error getting participants for account: ${error.message}`);
        });
    });

    describe('getParticipantUserState', () => {
        const roomId = 'test-room' as UUID;
        const userId = 'test-user' as UUID;

        beforeEach(() => {
            mockSupabase.eq
                .mockReturnValueOnce(mockSupabase)  // First eq call
                .mockReturnValue(mockSupabase);     // Second eq call
        });

        it('should return user state when it exists', async () => {
            mockSupabase.single.mockResolvedValueOnce({
                data: { userState: 'FOLLOWED' },
                error: null
            });

            const result = await adapter.getParticipantUserState(roomId, userId);

            expect(mockSupabase.from).toHaveBeenCalledWith('participants');
            expect(mockSupabase.select).toHaveBeenCalledWith('userState');
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, 'roomId', roomId);
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(2, 'userId', userId);
            expect(result).toBe('FOLLOWED');
        });

        it('should return null when user state does not exist', async () => {
            mockSupabase.single.mockResolvedValueOnce({
                data: { userState: null },
                error: null
            });

            const result = await adapter.getParticipantUserState(roomId, userId);

            expect(result).toBeNull();
        });

        it('should return null and log error when database error occurs', async () => {
            const error = { message: 'Database error' };
            mockSupabase.single.mockResolvedValueOnce({
                data: null,
                error
            });

            const result = await adapter.getParticipantUserState(roomId, userId);

            expect(result).toBeNull();
            expect(elizaLogger.error).toHaveBeenCalledWith('Error getting participant user state:', error);
        });
    });

    describe('setParticipantUserState', () => {
        const roomId = 'test-room' as UUID;
        const userId = 'test-user' as UUID;
        let updateResult: { error: null | { message: string } };

        beforeEach(() => {
            updateResult = { error: null };
            // Set up the chain of mock returns
            mockSupabase.from.mockReturnValue(mockSupabase);
            mockSupabase.update.mockReturnValue(mockSupabase);
            // Make eq return mockSupabase for the first call (roomId)
            // and the final result for the second call (userId)
            mockSupabase.eq
                .mockReturnValueOnce(mockSupabase)
                .mockImplementationOnce(() => Promise.resolve(updateResult));
        });

        it('should successfully update user state', async () => {
            await adapter.setParticipantUserState(roomId, userId, 'MUTED');

            expect(mockSupabase.from).toHaveBeenCalledWith('participants');
            expect(mockSupabase.update).toHaveBeenCalledWith({ userState: 'MUTED' });
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, 'roomId', roomId);
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(2, 'userId', userId);
        });

        it('should throw error and log when database error occurs', async () => {
            const error = { message: 'Database error' };
            updateResult.error = error;

            await expect(adapter.setParticipantUserState(roomId, userId, 'FOLLOWED'))
                .rejects
                .toThrow('Failed to set participant user state');

            expect(elizaLogger.error).toHaveBeenCalledWith('Error setting participant user state:', error);
        });

        it('should handle null state', async () => {
            await adapter.setParticipantUserState(roomId, userId, null);

            expect(mockSupabase.from).toHaveBeenCalledWith('participants');
            expect(mockSupabase.update).toHaveBeenCalledWith({ userState: null });
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, 'roomId', roomId);
            expect(mockSupabase.eq).toHaveBeenNthCalledWith(2, 'userId', userId);
        });
    });
});
