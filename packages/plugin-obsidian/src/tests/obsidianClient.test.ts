import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ObsidianProvider } from '../providers/obsidianClient';
import {
    elizaLogger,
    type AgentRuntime
} from "@elizaos/core";
import type { NoteContent, ResultNoteApi, ServerInfo } from '../types';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('ObsidianProvider', () => {
    let obsidianProvider: ObsidianProvider;
    const mockPort = 27123;
    const mockToken = 'test-token';
    const mockServerInfo: ServerInfo = {
        authenticated: true,
        ok: true,
        service: 'obsidian',
        versions: {
            obsidian: '1.0.0',
            self: '1.0.0'
        }
    };
    const mockRuntime: AgentRuntime = {
        logger: elizaLogger,
        getSetting: vi.fn().mockReturnValue('mock-api-key'),
        agentId: 'mock-agent-id',
        composeState: vi.fn().mockResolvedValue({}),
    } as unknown as AgentRuntime;

    beforeEach(async () => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Mock successful connection response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockServerInfo)
        });

        // Create a new instance for each test
        obsidianProvider = await ObsidianProvider.create(mockRuntime, mockPort, mockToken);
    });

    afterEach(() => {
        vi.clearAllMocks();
        ObsidianProvider['instance'] = null; // Reset singleton
        obsidianProvider.close();
    });

    describe('create and connect', () => {
        it('should create a new instance and connect successfully', async () => {
            expect(obsidianProvider).toBeDefined();
            expect(fetchMock).toHaveBeenCalledWith(
                'http://127.0.0.1:27123/',
                expect.objectContaining({
                    headers: {
                        Authorization: 'Bearer test-token'
                    }
                })
            );
        });

        it('should throw error if connection fails', async () => {
            vi.clearAllMocks();
            ObsidianProvider['instance'] = null;
            fetchMock.mockRejectedValueOnce(new Error('Connection failed'));

            await expect(ObsidianProvider.create(mockRuntime, mockPort, mockToken))
                .rejects.toThrow('Connection failed');
        });

        it('should handle authentication failure', async () => {
            vi.clearAllMocks();
            ObsidianProvider['instance'] = null;
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ ...mockServerInfo, authenticated: false })
            });

            await expect(ObsidianProvider.create(mockRuntime, mockPort, mockToken))
                .rejects.toThrow('Failed to authenticate with Obsidian API');
        });

        it('should reuse existing instance', async () => {
            const instance1 = obsidianProvider;
            const instance2 = await ObsidianProvider.create(mockRuntime, mockPort, mockToken);
            expect(instance1).toBe(instance2);
        });
    });

    describe('vault operations', () => {
        describe('listNotes', () => {
            it('should return list of notes', async () => {
                const mockNotes = ['note1.md', 'note2.md'];
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockNotes)
                });

                const notes = await obsidianProvider.listNotes();
                expect(notes).toEqual(mockNotes);
                expect(fetchMock).toHaveBeenCalledWith(
                    'http://127.0.0.1:27123/vault/',
                    expect.objectContaining({
                        headers: {
                            Authorization: 'Bearer test-token',
                            accept: 'application/json'
                        }
                    })
                );
            });
        });

        describe('getNote', () => {
            it('should return note content', async () => {
                const mockNote: NoteContent = {
                    content: 'Test content',
                    path: 'test.md',
                    tags: ['test'],
                    frontmatter: {},
                    stat: {
                        ctime: Date.now(),
                        mtime: Date.now(),
                        size: 100
                    }
                };

                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockNote)
                });

                const note = await obsidianProvider.getNote('test.md');
                expect(note).toEqual(mockNote);
            });
        });

        describe('getActiveNote', () => {
            it('should return active note content', async () => {
                const mockNote: NoteContent = {
                    content: 'Active note content',
                    path: 'active.md',
                    tags: ['active'],
                    frontmatter: {},
                    stat: {
                        ctime: Date.now(),
                        mtime: Date.now(),
                        size: 100
                    }
                };

                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockNote)
                });

                const note = await obsidianProvider.getActiveNote();
                expect(note).toEqual(mockNote);
            });

            it('should handle no active note', async () => {
                fetchMock.mockResolvedValueOnce({
                    ok: false,
                    status: 404,
                    json: () => Promise.reject(new Error('Not found'))
                });

                await expect(obsidianProvider.getActiveNote())
                    .rejects.toThrow('No active file found in Obsidian');
            });
        });
    });

    describe('file operations', () => {
        describe('listFiles', () => {
            it('should return list of files', async () => {
                const mockFiles = { files: ['file1.md', 'file2.pdf'] };
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockFiles)
                });

                const files = await obsidianProvider.listFiles();
                expect(files).toEqual(mockFiles.files);
            });
        });

        describe('listDirectoryFiles', () => {
            it('should return files in directory', async () => {
                const mockFiles = { files: ['dir/file1.md', 'dir/file2.md'] };
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockFiles)
                });

                const files = await obsidianProvider.listDirectoryFiles('dir');
                expect(files).toEqual(mockFiles.files);
            });
        });

        describe('readFile', () => {
            it('should return file content', async () => {
                const mockContent = '# Test Content';
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    text: () => Promise.resolve(mockContent)
                });

                const content = await obsidianProvider.readFile('test.md');
                expect(content).toBe(mockContent);
            });
        });
    });

    describe('command operations', () => {
        describe('listCommands', () => {
            it('should return list of commands', async () => {
                const mockCommands = [
                    { id: 'cmd1', name: 'Command 1' },
                    { id: 'cmd2', name: 'Command 2' }
                ];
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockCommands)
                });

                const commands = await obsidianProvider.listCommands();
                expect(commands).toEqual(mockCommands);
            });
        });
    });

    describe('search operations', () => {
        describe('search', () => {
            it('should perform plaintext search', async () => {
                const mockResults: ResultNoteApi[] = [{
                    filename: 'test.md',
                    matches: [{
                        context: 'test context',
                        match: { start: 0, end: 4 }
                    }],
                    score: 1.0
                }];

                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockResults)
                });

                const results = await obsidianProvider.search('test', 'plaintext');
                expect(results).toEqual(mockResults);
            });

            it('should perform dataview search', async () => {
                const mockResults: ResultNoteApi[] = [{
                    filename: 'test.md',
                    matches: [{
                        context: 'dataview result',
                        match: { start: 0, end: 8 }
                    }],
                    score: 1.0
                }];

                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockResults)
                });

                const results = await obsidianProvider.search('TABLE field FROM "folder"', 'dataview');
                expect(results).toEqual(mockResults);
            });

            it('should perform jsonlogic search', async () => {
                const mockResults: ResultNoteApi[] = [{
                    filename: 'test.md',
                    matches: [{
                        context: 'jsonlogic result',
                        match: { start: 0, end: 8 }
                    }],
                    score: 1.0
                }];

                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockResults)
                });

                const results = await obsidianProvider.search({ var: 'field' }, 'jsonlogic');
                expect(results).toEqual(mockResults);
            });
        });

        describe('simpleSearch', () => {
            it('should perform simple search with OR operator', async () => {
                const mockResults1: ResultNoteApi[] = [{
                    filename: 'test1.md',
                    matches: [{
                        context: 'keyword1 result',
                        match: { start: 0, end: 8 }
                    }],
                    score: 1.0
                }];

                const mockResults2: ResultNoteApi[] = [{
                    filename: 'test2.md',
                    matches: [{
                        context: 'keyword2 result',
                        match: { start: 0, end: 8 }
                    }],
                    score: 1.0
                }];

                fetchMock
                    .mockResolvedValueOnce({
                        ok: true,
                        json: () => Promise.resolve(mockResults1)
                    })
                    .mockResolvedValueOnce({
                        ok: true,
                        json: () => Promise.resolve(mockResults2)
                    });

                const results = await obsidianProvider.searchKeywords('keyword1 OR keyword2');
                expect(results).toHaveLength(2);
                expect(results[0].filename).toBe('test1.md');
                expect(results[1].filename).toBe('test2.md');
            });
        });
    });

    describe('error handling', () => {
        it('should handle HTTP errors', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => Promise.reject(new Error('Not found'))
            });

            await expect(obsidianProvider.listNotes())
                .rejects.toThrow('HTTP error! status: 404');
        });

        it('should handle network errors', async () => {
            fetchMock.mockRejectedValueOnce(new Error('Network error'));
            await expect(obsidianProvider.listNotes())
                .rejects.toThrow('Network error');
        });

        it('should handle invalid query format errors', async () => {
            await expect(async () => {
                await obsidianProvider.search({}, 'dataview');
            }).rejects.toThrow('Dataview query must be a string');

            await expect(async () => {
                await obsidianProvider.search('test', 'jsonlogic');
            }).rejects.toThrow('JsonLogic query must be an object');
        });
    });

    describe('utility methods', () => {
        it('should check connection status', () => {
            expect(obsidianProvider.isConnected()).toBe(true);
            obsidianProvider.close();
            expect(obsidianProvider.isConnected()).toBe(false);
        });
    });
});
