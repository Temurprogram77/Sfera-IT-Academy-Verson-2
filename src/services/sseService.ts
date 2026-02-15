export type SSECallback<T = any> = (data: T) => void;

export interface SSEOptions {
  url: string;
  eventName: string;
  onMessage: SSECallback;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

export function createSSE({
  url,
  eventName,
  onMessage,
  onError,
  onOpen,
}: SSEOptions) {
  const es = new EventSource(url);

  es.onopen = () => {
    console.log("✅ SSE Connected:", url);
    onOpen?.();
  };

  es.onerror = (error) => {
    console.error("❌ SSE Error:", error);
    onError?.(error);
  };

  es.addEventListener(eventName, (event: MessageEvent) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
    }
  });

  return {
    close: () => {
      console.log("🔌 SSE Closed");
      es.close();
    },
  };
}
