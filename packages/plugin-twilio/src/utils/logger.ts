export class SafeLogger {
    private static readonly PREFIX = '[Twilio Plugin]';
    private static debugMode = false;

    static setDebugMode(enabled: boolean): void {
        this.debugMode = enabled;
    }

    static info(message: string, data?: any): void {
        if (data?.text) {
            // For messages with text content, show simplified format
            console.log(`${this.PREFIX} ${message} "${data.text}"`);
        } else if (data?.duration) {
            // For messages with significant duration (>1 second)
            const duration = parseFloat(data.duration);
            if (duration > 1) {
                console.log(`${this.PREFIX} ${message} (${duration.toFixed(2)}s)`);
            } else {
                console.log(`${this.PREFIX} ${message}`);
            }
        } else {
            // For status updates, just show the message
            console.log(`${this.PREFIX} ${message}`);
        }
    }

    static error(message: string, error?: any): void {
        if (error) {
            console.error(`${this.PREFIX} ❌ ${message}`, error);
        } else {
            console.error(`${this.PREFIX} ❌ ${message}`);
        }
    }

    static service(serviceName: string, message: string, ...args: any[]): void {
        console.log(`${this.PREFIX} [${serviceName}] ${message}`, ...this.sanitizeArgs(args));
    }

    static debug(message: string, ...args: any[]): void {
        if (this.debugMode || process.env.DEBUG) {
            console.debug(`${this.PREFIX} ${message}`, ...this.sanitizeArgs(args));
        }
    }

    static log(...args: any[]): void {
        console.log(`${this.PREFIX}`, ...this.sanitizeArgs(args));
    }

    static warn(...args: any[]): void {
        console.warn(`${this.PREFIX}`, ...this.sanitizeArgs(args));
    }

    static wrapCoreLogger(message: string, data?: any): void {
        if (data) {
            console.log(`${this.PREFIX} ${message}:`, this.sanitizeArgs([data])[0]);
        } else {
            console.log(`${this.PREFIX} ${message}`);
        }
    }

    private static sanitize(text: string): string {
        return text
            .replace(/sk-[a-zA-Z0-9-]{20,}/g, '[API_KEY]')
            .replace(/\+\d{10,}/g, '[PHONE]')
            .replace(/sid_[a-zA-Z0-9-]{20,}/g, '[SID]');
    }

    private static sanitizeArgs(args: any[]): any[] {
        return args.map(arg => {
            if (typeof arg === 'string') {
                return this.sanitize(arg);
            }
            if (arg instanceof Error) {
                return new Error(this.sanitize(arg.message));
            }
            if (typeof arg === 'object') {
                return JSON.parse(this.sanitize(JSON.stringify(arg)));
            }
            return arg;
        });
    }

    // Method for initialization logs
    static init(service: string, data: any): void {
        console.log(`${this.PREFIX} Initialized ${service} with:`, this.sanitize(JSON.stringify(data)));
    }

    static anthropicDebug(type: string, data: any): void {
        const sanitizedData = typeof data === 'string' ?
            this.sanitize(data) :
            this.sanitize(JSON.stringify(data));
        console.log(`${this.PREFIX} Anthropic:${type}:`, sanitizedData);
    }
}