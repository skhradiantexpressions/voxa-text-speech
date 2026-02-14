import React, { useEffect } from 'react';
import { useDictation } from '../hooks/useDictation';
import { Mic, MicOff, Copy, Trash2 } from 'lucide-react';

export function Editor() {
    const { text, state, start, stop, clear, error } = useDictation();
    const isListening = state === 'listening';

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-200">New Note</h2>
                <div className="flex gap-2">
                    <button
                        onClick={clear}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                        title="Clear text"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/10 rounded-lg transition-colors"
                        title="Copy to clipboard"
                    >
                        <Copy size={20} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl relative flex flex-col">
                <textarea
                    className="flex-1 w-full bg-transparent text-slate-100 text-lg md:text-xl leading-relaxed resize-none outline-none placeholder:text-slate-600 font-light"
                    placeholder="Tap the microphone below and start speaking..."
                    value={text}
                    readOnly
                />

                {/* Status Indicator */}
                <div className="absolute bottom-6 right-6 text-xs font-mono text-slate-500">
                    {state === 'listening' ? 'Listening...' : 'Ready'}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center items-center pb-8">
                <button
                    onClick={isListening ? stop : start}
                    className={`relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-2xl ${isListening
                            ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/50'
                            : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-110 hover:shadow-blue-500/25'
                        }`}
                >
                    {/* Ripple effect when listening */}
                    {isListening && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
                    )}

                    {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </button>
            </div>

            {error && (
                <div className="mx-auto mt-4 px-4 py-2 bg-red-900/30 text-red-200 rounded-full text-center text-sm border border-red-800/50 backdrop-blur-sm">
                    Error: {error}
                </div>
            )}
        </div>
    );
}
