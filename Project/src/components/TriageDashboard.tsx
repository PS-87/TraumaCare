import type { DistressResult } from '@/lib/distressEngine';
import { AlertTriangle, ShieldCheck, Activity, Zap } from 'lucide-react';

export default function TriageDashboard({ result }: { result: DistressResult }) {
  const { score, triage, features } = result;
  const isRed = triage.includes('RED');
  const isYellow = triage.includes('YELLOW');

  const badgeColor = isRed ? 'text-red-400' : isYellow ? 'text-amber-400' : 'text-emerald-400';
  const ringColor = isRed ? 'from-red-500 to-red-700' : isYellow ? 'from-amber-500 to-amber-700' : 'from-emerald-500 to-emerald-700';

  return (
    <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 overflow-hidden">
      {/* Score header */}
      <div className="p-4 sm:p-6 border-b border-stone-700/50">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-fluid-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
              Dynamic Distress Score (DDS)
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-fluid-5xl font-extrabold ${badgeColor} tracking-tight`}>{score}</span>
              <span className="text-fluid-base text-stone-500 font-medium">/ 100</span>
            </div>
            <p className="text-fluid-sm text-stone-300 mt-1 font-medium">{triage}</p>
          </div>

          {/* Circular progress ring */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#44403c" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                stroke={isRed ? '#ef4444' : isYellow ? '#f59e0b' : '#10b981'}
                strokeDasharray={`${(score / 100) * 264} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${ringColor} flex items-center justify-center shadow-lg`}>
                {isRed ? <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : isYellow ? <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage directive */}
      <div className={`p-4 sm:p-5 border-b border-stone-700/50 ${isRed ? 'bg-red-950/30' : isYellow ? 'bg-amber-950/30' : 'bg-emerald-950/30'}`}>
        {isRed && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300 text-fluid-sm">CRITICAL INTERVENTION DIRECTIVE ACTIVATED</p>
              <p className="text-red-400/80 text-fluid-sm mt-0.5">Immediate notification dispatched to District Protection Officer. Priority VR Box-Breathing recommended below.</p>
            </div>
          </div>
        )}
        {isYellow && (
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 text-fluid-sm">ELEVATED DISTRESS DETECTED</p>
              <p className="text-amber-400/80 text-fluid-sm mt-0.5">Automated support ticket created for District Tele-Counselor 24h outreach.</p>
            </div>
          </div>
        )}
        {!isRed && !isYellow && (
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300 text-fluid-sm">STABLE BASELINE MAINTAINED</p>
              <p className="text-emerald-400/80 text-fluid-sm mt-0.5">Hearing logistics sent via SMS. Routine psychoeducation guidelines refreshed.</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature metrics */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-stone-500" />
          <p className="text-fluid-xs font-semibold text-stone-500 uppercase tracking-wide">Extracted Bio-Acoustic & NLP Features</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FeatureCard label="Pitch Jitter" value={features.pitch_jitter.toString()} accent="sky" />
          <FeatureCard label="Hesitation Ratio" value={features.pause_ratio.toString()} accent="blue" />
          <FeatureCard label="Trauma Keywords" value={features.trauma_keywords.toString()} accent="rose" />
          <FeatureCard label="Negative Sentiment" value={features.negative_sentiment.toString()} accent="red" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ label, value, accent }: { label: string; value: string; accent: 'sky' | 'blue' | 'rose' | 'red' }) {
  const colors = {
    sky: 'text-sky-400 bg-sky-950/30 border-sky-900/40',
    blue: 'text-blue-400 bg-blue-950/30 border-blue-900/40',
    rose: 'text-rose-400 bg-rose-950/30 border-rose-900/40',
    red: 'text-red-400 bg-red-950/30 border-red-900/40',
  };
  return (
    <div className={`rounded-xl p-3 sm:p-4 border ${colors[accent]}`}>
      <p className="text-fluid-lg sm:text-fluid-xl font-bold">{value}</p>
      <p className="text-fluid-xs font-medium mt-1 opacity-80">{label}</p>
    </div>
  );
}
