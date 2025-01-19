import { Action } from '@elizaos/core';
import { sms } from './sms.js';
import { call } from './call.js';

// Export as an array of actions, not an object
export const actions: Action[] = [sms, call];