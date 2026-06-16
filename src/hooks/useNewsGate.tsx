import { useEffect, useRef, useState } from 'react';

export function useNewsGate() {
    const [ready, setReady] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const render = () => {
            // @ts-ignore
            window.turnstile?.render(ref.current, {
                sitekey: '0x4AAAAAADmA0rWi7dY5hUWW',
                callback: async (token: string) => {
                    const r = await fetch('/verify.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ token }),
                        credentials: 'include',
                    });
                    if (r.ok) setReady(true);
                },
            });
        };
        // @ts-ignore
        if (window.turnstile) render();
        else {
            const id = setInterval(() => {
                // @ts-ignore
                if (window.turnstile) { clearInterval(id); render(); }
            }, 200);
            return () => clearInterval(id);
        }
    }, []);

    return { ready, ref };
}