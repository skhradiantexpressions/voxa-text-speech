import React, { ReactNode } from 'react';
import { Mic, Settings, LayoutGrid } from 'lucide-react';

export type View = 'editor' | 'settings';

interface AppShellProps {
    children: ReactNode;
    activeView: View;
    onNavigate: (view: View) => void;
}

export function AppShell({ children, activeView, onNavigate }: AppShellProps) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-6 gap-2 backdrop-blur-md z-10">
                <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-8 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Mic size={20} className="text-white" />
                    </div>
                    <span className="hidden lg:block font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Voxa
                    </span>
                </div>

                <nav className="flex-1 flex flex-col gap-1 px-2">
                    <NavItem
                        icon={<LayoutGrid size={20} />}
                        label="Editor"
                        active={activeView === 'editor'}
                        onClick={() => onNavigate('editor')}
                    />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={activeView === 'settings'}
                        onClick={() => onNavigate('settings')}
                    />
                </nav>

                <div className="p-4 border-t border-slate-800 hidden lg:block">
                    <div className="text-xs text-slate-500 text-center">
                        v1.0.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-grid-slate-800/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] " />

                <div className="relative z-10 h-full p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group w-full ${active
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
        >
            {icon}
            <span className="hidden lg:block text-sm">{label}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}
        </button>
    );
}
