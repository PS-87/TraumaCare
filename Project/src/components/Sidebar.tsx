import { useAuth } from '@/context/AuthContext';
import { Shield, LogOut, Calendar, AlertTriangle, Sliders } from 'lucide-react';

interface SidebarProps {
  daysToHearing: number;
  setDaysToHearing: (v: number) => void;
  threatFlag: number;
  setThreatFlag: (v: number) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

const TABS = [
  { id: 'voice', label: 'Voice Stress Intake', icon: 'mic' },
  { id: 'text', label: 'Written Statement', icon: 'pen' },
  { id: 'vr', label: 'VR Grounding', icon: 'vr' },
  { id: 'history', label: 'Score History', icon: 'scroll' },
];

export default function Sidebar({
  daysToHearing,
  setDaysToHearing,
  threatFlag,
  setThreatFlag,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const { profile, signOut } = useAuth();

  return (
    <aside className="w-full lg:w-64 xl:w-72 lg:min-h-screen bg-stone-900 border-r border-stone-700/50 flex flex-col flex-shrink-0">
      {/* Identity */}
      <div className="p-4 sm:p-5 border-b border-stone-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-fluid-sm font-bold text-stone-100 leading-tight">TraumaCare VR</h1>
            <p className="text-fluid-xs text-stone-500">Portal Identity</p>
          </div>
        </div>

        <div className="bg-stone-800/50 rounded-xl p-3 border border-stone-700/50">
          <p className="text-stone-100 font-semibold text-fluid-sm truncate">{profile?.full_name ?? 'Protected Witness'}</p>
          <p className="text-fluid-xs text-stone-400 mt-1 font-mono">
            Case: {profile?.case_id ?? 'CR-2026-WB-092'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 border-b border-stone-700/50">
        <p className="text-fluid-xs font-semibold text-stone-500 uppercase tracking-wide px-2 mb-2">Modules</p>
        <div className="space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-fluid-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/10 text-sky-300 border border-sky-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <span className="w-5 text-center text-fluid-sm">
                {tab.icon === 'mic' && '🎙'}
                {tab.icon === 'pen' && '✍'}
                {tab.icon === 'vr' && '🥽'}
                {tab.icon === 'scroll' && '📜'}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Baseline parameters */}
      <div className="p-4 sm:p-5 border-b border-stone-700/50 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-stone-400" />
          <p className="text-fluid-xs font-semibold text-stone-500 uppercase tracking-wide">Baseline Parameters</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <label className="text-fluid-xs font-semibold text-stone-300">Days to Next Hearing</label>
          </div>
          <input
            type="range"
            min={1}
            max={90}
            value={daysToHearing}
            onChange={(e) => setDaysToHearing(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-fluid-xs text-stone-500 mt-1">
            <span>1d</span>
            <span className="text-sky-400 font-bold">{daysToHearing}d</span>
            <span>90d</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-sky-400" />
            <label className="text-fluid-xs font-semibold text-stone-300">Direct Intimidation Reported?</label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setThreatFlag(0)}
              className={`flex-1 py-2 rounded-lg text-fluid-xs font-semibold transition-all ${
                threatFlag === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-stone-800 text-stone-500 border border-stone-700'
              }`}
            >
              No Threat
            </button>
            <button
              onClick={() => setThreatFlag(1)}
              className={`flex-1 py-2 rounded-lg text-fluid-xs font-semibold transition-all ${
                threatFlag === 1
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-stone-800 text-stone-500 border border-stone-700'
              }`}
            >
              Active Threat
            </button>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="p-4">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-stone-800 hover:bg-red-900/30 text-stone-400 hover:text-red-400 text-fluid-sm font-semibold transition-all border border-stone-700 hover:border-red-500/30"
        >
          <LogOut className="w-4 h-4" />
          Sign Out & End Session
        </button>
      </div>
    </aside>
  );
}
