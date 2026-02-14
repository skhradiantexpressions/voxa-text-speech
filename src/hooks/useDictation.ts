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

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // We append final results to state, how to handle interim?
            // For a text editor, we usually want: existingText + pendingText
            // But here we might just return the stream and let the UI handle appending?
            // Let's simplify and just accumulate everything in this session.
            // Actually, relying on `event.results` accumulator is safer.
            const fullTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');

            setText(fullTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setState('error');
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
