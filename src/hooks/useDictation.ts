import { useState, useCallback, useRef, useEffect } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: any) => void;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export type DictationState = 'idle' | 'listening' | 'error';

export function useDictation() {
    const [text, setText] = useState('');
    const [state, setState] = useState<DictationState>('idle');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Browser does not support Speech Recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    // If we are in Electron, type this out!
                    if (window.electron) {
                        await window.electron.typeText(event.results[i][0].transcript);
                    }
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Just for display in the app, we can keep the full history or just show recent
            // For now, let's just keep appending to our local state so the user sees it too.
            setText(prev => prev + finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setError(JSON.stringify(event.error));
            setState('idle'); // Reset state on error so we can try again
        };

        recognition.onend = () => {
            setState('idle');
        };

        recognitionRef.current = recognition;
    }, []);

    const start = useCallback(() => {
        if (recognitionRef.current && state !== 'listening') {
            try {
                recognitionRef.current.start();
                setState('listening');
                setError(null);
            } catch (e) {
                console.error(e);
            }
        }
    }, [state]);

    const stop = useCallback(() => {
        if (recognitionRef.current && state === 'listening') {
            recognitionRef.current.stop();
            setState('idle');
        }
    }, [state]);

    const clear = useCallback(() => setText(''), []);

    return { text, state, start, stop, clear, error };
}
