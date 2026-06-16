import { useEffect, useRef, useState } from 'react';

export function useNewsGate() {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      // @ts-ignore
      const ts = window.turnstile;

      // wait until BOTH the script AND the container div exist
      if (!ts || !ref.current) {
        setTimeout(tryRender, 200);
        return;
      }
      // don't render twice (Strict Mode runs effects twice in dev)
      if (widgetId.current !== null) return;

      widgetId.current = ts.render(ref.current, {
        sitekey: '0x4AAAAAADmA0rWi7dY5hUWW',
        callback: async (token: string) => {
          const r = await fetch('/api/verify.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token }),
            credentials: 'include',
          });
          if (r.ok && !cancelled) setReady(true);
        },
      });
    };

    tryRender();

    return () => {
      cancelled = true;
      // @ts-ignore
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  return { ready, ref };
}