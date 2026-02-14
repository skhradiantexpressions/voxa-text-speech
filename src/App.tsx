import React, { useState } from 'react'
import { AppShell, View } from './components/AppShell'
import { Editor } from './components/Editor'
import { Settings } from './components/Settings'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import './index.css'

function App() {
    const [view, setView] = useState<View>('editor');

    return (
        <AppShell activeView={view} onNavigate={setView}>
            {view === 'editor' ? <Editor /> : <Settings />}
            <PWAInstallPrompt />
        </AppShell>
    )
}

export default App
