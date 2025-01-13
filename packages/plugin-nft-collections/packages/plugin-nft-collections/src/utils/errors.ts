export class BaseError extends Error { public readonly isOperational: boolean; public context?: Record<string, unknown>; constructor(message: string, options: { isOperational?: boolean, context?: Record<string, unknown> } = {}) { super(message); this.name = this.constructor.name; this.isOperational = options.isOperational ?? true; this.context = options.context || {}; Error.captureStackTrace(this, this.constructor); } }
