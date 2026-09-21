import { useState } from 'react';
import { PenLine, Loader2, Zap } from 'lucide-react';
import { computeDistressScore, type DistressResult } from '@/lib/distressEngine';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import TriageDashboard from './TriageDashboard';

const DEFAULT_STATEMENT = `URGENT: I cannot speak on call right now because people are watching outside my window. Accused associates approached my brother this afternoon and threatened dire consequences if I testify on Monday. I am facing severe coercion and intimidation. Request immediate police escort and witness protection under Section 398 BNSS.`;

interface TextTabProps {
  daysToHearing: number;
  threatFlag: number;
}

export default function TextTab({ daysToHearing, threatFlag }: TextTabProps) {
  const { user } = useAuth();
  const [statement, setStatement] = useState(DEFAULT_STATEMENT);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DistressResult | null>(null);

  async function evaluateText() {
    setAnalyzing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 300));

    const text = statement.trim() || 'Neutral statement';
    const res = computeDistressScore(null, text, daysToHearing, threatFlag);
    setResult(res);

    if (user) {
      await supabase.from('sessions').insert({
        user_id: user.id,
        intake_mode: 'Written Report',
        score: res.score,
        triage: res.triage,
        transcript: statement,
        features: res.features,
      });
    }

    setAnalyzing(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Left: Input */}
      <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <PenLine className="w-5 h-5 text-sky-500" />
          <h3 className="text-fluid-lg font-bold text-stone-100">Written Trauma & Situation Report</h3>
        </div>
        <p className="text-fluid-sm text-stone-400 mb-6">
          Detailed description of threats, intimidation, or procedural anxiety.
        </p>

        <div className="mb-4">
          <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
            Describe what happened:
          </label>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 text-fluid-xs text-stone-500">
          <span className="px-2 py-1 rounded-md bg-stone-700/50 font-mono">{statement.split(/\s+/).filter(Boolean).length} words</span>
          <span className="px-2 py-1 rounded-md bg-stone-700/50 font-mono">{statement.length} chars</span>
        </div>

        <button
          onClick={evaluateText}
          disabled={analyzing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-fluid-sm hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Zap className="w-4 h-4" /> Evaluate Written Report</>
          )}
        </button>
      </div>

      {/* Right: Results */}
      <div>
        {!result && !analyzing && (
          <div className="bg-stone-800/40 rounded-2xl border border-dashed border-stone-700 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <PenLine className="w-10 h-10 sm:w-12 sm:h-12 text-stone-600 mb-3" />
            <p className="text-stone-500 text-fluid-sm">Write your statement and click "Evaluate" to see your distress triage results.</p>
          </div>
        )}

        {analyzing && (
          <div className="bg-stone-800/40 rounded-2xl border border-stone-700/60 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-3" />
            <p className="text-stone-300 text-fluid-sm font-medium">Extracting NLP features & calculating distress score...</p>
          </div>
        )}

        {result && !analyzing && (
          <div className="space-y-4">
            <TriageDashboard result={result} />

            {result.triage.includes('RED') && (
              <div className="bg-stone-800/80 rounded-2xl shadow-lg border-2 border-red-900/50 p-4 sm:p-5">
                <h4 className="text-fluid-sm font-bold text-red-300 mb-3">Recommended Clinical Intervention</h4>
                <iframe src="/sanctuary.html" className="w-full rounded-xl border border-stone-700/60" style={{ height: 'clamp(320px, 50vh, 480px)' }} title="VR Sanctuary" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
