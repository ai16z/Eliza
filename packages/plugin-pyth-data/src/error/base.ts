// Base error codes
export enum PythErrorCode {
  // WebSocket connection errors
  WS_CONNECTION_TIMEOUT = 'WS_CONNECTION_TIMEOUT',
  WS_CONNECTION_REFUSED = 'WS_CONNECTION_REFUSED',
  WS_INVALID_URL = 'WS_INVALID_URL',
  WS_HEARTBEAT_FAILED = 'WS_HEARTBEAT_FAILED',
  WS_SSL_ERROR = 'WS_SSL_ERROR',
  WS_INVALID_STATE_TRANSITION = 'WS_INVALID_STATE_TRANSITION',
  WS_MESSAGE_PARSE_ERROR = 'WS_MESSAGE_PARSE_ERROR',
  WS_RATE_LIMIT_EXCEEDED = 'WS_RATE_LIMIT_EXCEEDED',
  WS_INVALID_MESSAGE_FORMAT = 'WS_INVALID_MESSAGE_FORMAT',

  // Runtime errors
  RUNTIME_INITIALIZATION = 'RUNTIME_INITIALIZATION',
  RUNTIME_CONFIGURATION = 'RUNTIME_CONFIGURATION',
  RUNTIME_VALIDATION = 'RUNTIME_VALIDATION',

  // State management errors
  STATE_INVALID_TRANSITION = 'STATE_INVALID_TRANSITION',
  STATE_PERSISTENCE = 'STATE_PERSISTENCE',
  STATE_UNEXPECTED_DISCONNECT = 'STATE_UNEXPECTED_DISCONNECT',
  STATE_RECONNECTION_FAILED = 'STATE_RECONNECTION_FAILED',
  STATE_MAX_RECONNECT_EXCEEDED = 'STATE_MAX_RECONNECT_EXCEEDED',

  // Data handling errors
  DATA_INVALID_SUBSCRIPTION = 'DATA_INVALID_SUBSCRIPTION',
  DATA_SUBSCRIPTION_LIMIT = 'DATA_SUBSCRIPTION_LIMIT',
  DATA_VALIDATION_FAILED = 'DATA_VALIDATION_FAILED',
  DATA_SEQUENCE_ERROR = 'DATA_SEQUENCE_ERROR',
  DATA_TRANSFORM_ERROR = 'DATA_TRANSFORM_ERROR',
  DATA_SCHEMA_ERROR = 'DATA_SCHEMA_ERROR',
  DATA_STALE_PRICE = 'DATA_STALE_PRICE',
  DATA_CHAIN_ERROR = 'DATA_CHAIN_ERROR',
  DATA_PARSE_ERROR = 'DATA_PARSE_ERROR',
  DATA_PRICE_UNAVAILABLE = 'DATA_PRICE_UNAVAILABLE',
  DATA_CONFIDENCE_TOO_LOW = 'DATA_CONFIDENCE_TOO_LOW',
  DATA_CONTRACT_ERROR = 'DATA_CONTRACT_ERROR',

  // Generic errors
  UNKNOWN = 'UNKNOWN',
  INTERNAL = 'INTERNAL',
  NETWORK = 'NETWORK',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  SUBSCRIPTION_LIMIT_EXCEEDED = 'SUBSCRIPTION_LIMIT_EXCEEDED',
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR',
  MESSAGE_PROCESSING_ERROR = 'MESSAGE_PROCESSING_ERROR',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  HANDLER_FAILED = 'HANDLER_FAILED',

  // Generic Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',         // Non-critical errors that don't affect core functionality
  MEDIUM = 'MEDIUM',   // Errors that affect some functionality but system can continue
  HIGH = 'HIGH',       // Critical errors that require immediate attention
  FATAL = 'FATAL'      // System cannot continue operation
}

// Error detail types
export interface ErrorDetails {
  [key: string]: unknown;
}

// Extended error interface
export interface IPythError {
  code: PythErrorCode;
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  details?: ErrorDetails;
  originalError?: Error;
  name: string;
}

// Base Pyth error class
export class PythError extends Error implements IPythError {
  public readonly timestamp: number;
  public readonly name: string = 'PythError';

  constructor(
    public readonly code: PythErrorCode,
    public readonly message: string,
    public readonly severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public readonly details?: ErrorDetails,
    public readonly originalError?: Error
  ) {
    super(message);
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): object {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }
}

// Error utility functions
export const createError = (
  code: PythErrorCode,
  message: string,
  severity?: ErrorSeverity,
  details?: ErrorDetails,
  originalError?: Error
): PythError => {
  return new PythError(code, message, severity, details, originalError);
}; 