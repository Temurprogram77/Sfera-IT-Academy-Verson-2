// services/sseService.ts

interface SSEOptions<T> {
  url: string;
  eventName: string;
  onMessage: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void; // 1. Added onOpen to the interface
}

export function createSSE<T>({
  url,
  eventName,
  onMessage,
  onError,
  onOpen, // 2. Destructure onOpen
}: SSEOptions<T>) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

  // EventSource natively doesn't support custom headers,
  // so we append token as query param if needed
  const fullUrl = token ? `${url}?token=${token}` : url;

  const eventSource = new EventSource(fullUrl);

  // 3. Handle the open event
  eventSource.onopen = () => {
    onOpen?.();
  };

  eventSource.addEventListener(eventName, (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data) as T;
      onMessage(data);
    } catch (err) {
      console.error("SSE parse error:", err);
    }
  });

  eventSource.onerror = (e) => {
    console.error("SSE error:", e);
    onError?.(e);
  };

  return {
    close: () => eventSource.close(),
    eventSource,
  };
}