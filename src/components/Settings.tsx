import React from 'react';
import { Globe, Wand2, Shield } from 'lucide-react';

export function Settings() {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Settings</h2>

            <div className="space-y-6">
                <SettingSection title="Language" icon={<Globe className="text-blue-400" />}>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                    </select>
                </SettingSection>

                <SettingSection title="Transcription Mode" icon={<Wand2 className="text-purple-400" />}>
                    <div className="flex bg-slate-800 p-1 rounded-lg">
                        <button className="flex-1 py-2 px-4 rounded-md bg-slate-700 text-slate-100 shadow-sm text-sm font-medium">Lightning (Raw)</button>
                        <button className="flex-1 py-2 px-4 rounded-md text-slate-400 hover:text-slate-200 text-sm font-medium">Polished (AI)</button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Lightning mode uses on-device processing. Polished mode (coming soon) uses AI to fix grammar.
                    </p>
                </SettingSection>

                <SettingSection title="Privacy" icon={<Shield className="text-green-400" />}>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div>
                            <h4 className="font-medium text-slate-200">Local Processing</h4>
                            <p className="text-sm text-slate-400">Audio never leaves your browser</p>
                        </div>
                        <div className="w-10 h-6 bg-green-500/20 rounded-full border border-green-500/50 relative flex items-center px-1">
                            <div className="w-4 h-4 bg-green-400 rounded-full shadow-sm translate-x-4" />
                        </div>
                    </div>
                </SettingSection>
            </div>
        </div>
    );
}

function SettingSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-300">
                {icon}
                <h3 className="font-medium">{title}</h3>
            </div>
            {children}
        </div>
    )
}
