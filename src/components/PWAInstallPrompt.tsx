import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (!deferredPrompt) return null;

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    return (
        <button
            onClick={handleInstall}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 font-medium transition-all hover:scale-105"
        >
            <Download size={18} />
            Install Voxa
        </button>
    );
}
