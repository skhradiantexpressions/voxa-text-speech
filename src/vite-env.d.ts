/// <reference types="vite/client" />

interface Window {
    electron: {
        typeText: (text: string) => Promise<boolean>;
    };
}
