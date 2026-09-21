import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Sidebar from '@/components/Sidebar';
import VoiceTab from '@/components/VoiceTab';
import TextTab from '@/components/TextTab';
import VRTab from '@/components/VRTab';
import HistoryTab from '@/components/HistoryTab';
import { Shield, Loader2 } from 'lucide-react';

export default function App() {
  const { session, loading } = useAuth();
  const [daysToHearing, setDaysToHearing] = useState(6);
  const [threatFlag, setThreatFlag] = useState(0);
  const [activeTab, setActiveTab] = useState('voice');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-stone-950">
      <Sidebar
        daysToHearing={daysToHearing}
        setDaysToHearing={setDaysToHearing}
        threatFlag={threatFlag}
        setThreatFlag={setThreatFlag}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 overflow-x-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-stone-900/80 backdrop-blur-md border-b border-stone-700/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-fluid-lg font-bold text-stone-100 leading-tight">TraumaCare VR</h1>
                <p className="text-fluid-xs text-stone-500">Intake, Triage & Grounding Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-fluid-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Authenticated Session Active
              </span>
            </div>
          </div>
        </header>

        {/* Tab content */}
        <div key={activeTab} className="p-4 sm:p-6 max-w-7xl mx-auto fade-in">
          {activeTab === 'voice' && <VoiceTab daysToHearing={daysToHearing} threatFlag={threatFlag} />}
          {activeTab === 'text' && <TextTab daysToHearing={daysToHearing} threatFlag={threatFlag} />}
          {activeTab === 'vr' && <VRTab />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </main>
    </div>
  );
}
