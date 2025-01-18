export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
    private state: CircuitBreakerState = "CLOSED";
    private failureCount = 0;
    private lastFailureTime?: number;
    private halfOpenSuccesses = 0;

    private readonly failureThreshold: number;
    private readonly resetTimeout: number;
    private readonly halfOpenMaxAttempts: number;

    constructor(
        private readonly config: {
            failureThreshold?: number;
            resetTimeout?: number;
            halfOpenMaxAttempts?: number;
        } = {}
    ) {
        this.failureThreshold = config.failureThreshold ?? 5;
        this.resetTimeout = config.resetTimeout ?? 60000;
        this.halfOpenMaxAttempts = config.halfOpenMaxAttempts ?? 3;
    }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === "OPEN") {
            if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
                this.state = "HALF_OPEN";
                this.halfOpenSuccesses = 0;
            } else {
                throw new Error("Circuit breaker is OPEN");
            }
        }

        try {
            const result = await operation();

            if (this.state === "HALF_OPEN") {
                this.halfOpenSuccesses++;
                if (this.halfOpenSuccesses >= this.halfOpenMaxAttempts) {
                    this.reset();
                }
            }

            return result;
        } catch (error) {
            this.handleFailure();
            throw error;
        }
    }

    private handleFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (
            this.state !== "OPEN" &&
            this.failureCount >= this.failureThreshold
        ) {
            this.state = "OPEN";
        }
    }

    private reset(): void {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.lastFailureTime = undefined;
    }

    getState(): "CLOSED" | "OPEN" | "HALF_OPEN" {
        return this.state;
    }
}
