declare module 'eventsource' {
  interface EventSourceInit {
    headers?: HeadersInit;
    https?: {
      rejectUnauthorized?: boolean;
      ca?: string | Buffer | Array<string | Buffer>;
      cert?: string | Buffer;
      key?: string | Buffer;
      passphrase?: string;
    };
    withCredentials?: boolean;
    proxy?: string;
  }

  interface EventSourceStatic {
    new(url: string | URL, eventSourceInitDict?: EventSourceInit): EventSource;
    readonly prototype: EventSource;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSED: 2;
  }

  interface EventSource {
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSED: 2;
    readonly readyState: 0 | 1 | 2;
    readonly url: string;
    readonly withCredentials: boolean;
    onopen: ((event: Event) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
    close(): void;
  }

  const EventSource: EventSourceStatic;
  export = EventSource;
}