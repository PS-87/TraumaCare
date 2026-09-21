import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ScrollText, Loader2, Calendar, Activity, Gauge } from 'lucide-react';

interface SessionRecord {
  id: string;
  intake_mode: string;
  score: number;
  triage: string;
  transcript: string;
  created_at: string;
}

export default function HistoryTab() {
  const { user } = useAuth();
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      const { data, error } = await supabase
        .from('sessions')
        .select('id, intake_mode, score, triage, transcript, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('History load error:', error.message);
      } else {
        setRecords((data ?? []) as SessionRecord[]);
      }
      setLoading(false);
    }
    loadHistory();
  }, [user]);

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function triageColor(triage: string): string {
    if (triage.includes('RED')) return 'bg-red-950/40 text-red-300 border-red-900/50';
    if (triage.includes('YELLOW')) return 'bg-amber-950/40 text-amber-300 border-amber-900/50';
    return 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50';
  }

  function scoreColor(score: number): string {
    if (score >= 60) return 'text-red-400';
    if (score >= 30) return 'text-amber-400';
    return 'text-emerald-400';
  }

  return (
    <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <ScrollText className="w-5 h-5 text-stone-400" />
        <h3 className="text-fluid-lg font-bold text-stone-100">Case Intake & Triage Audit Trail</h3>
      </div>
      <p className="text-fluid-sm text-stone-400 mb-6">Complete history of your distress check-ins and triage assessments.</p>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-3" />
          <p className="text-fluid-sm text-stone-400">Loading session history...</p>
        </div>
      )}

      {!loading && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ScrollText className="w-10 h-10 sm:w-12 sm:h-12 text-stone-600 mb-3" />
          <p className="text-stone-500 text-fluid-sm">No recorded check-ins found for this identity profile.</p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-stone-700/60">
            <table className="w-full text-fluid-sm">
              <thead>
                <tr className="bg-stone-700/30 border-b border-stone-700/60">
                  <th className="px-4 py-3 text-left font-semibold text-stone-400 text-fluid-xs uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" /> Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-400 text-fluid-xs uppercase tracking-wide">
                    <Activity className="w-3.5 h-3.5 inline mr-1" /> Intake Mode
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-400 text-fluid-xs uppercase tracking-wide">
                    <Gauge className="w-3.5 h-3.5 inline mr-1" /> Distress Score
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-400 text-fluid-xs uppercase tracking-wide">
                    Assigned Triage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/40">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-700/20 transition-colors">
                    <td className="px-4 py-3 text-stone-300 whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-stone-300">
                      <span className="inline-flex items-center gap-1.5">
                        {r.intake_mode === 'Voice Check-In' ? '🎙' : '✍'} {r.intake_mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-fluid-lg font-bold ${scoreColor(r.score)}`}>{r.score}</span>
                      <span className="text-stone-500 text-fluid-xs">/100</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-fluid-xs font-semibold border ${triageColor(r.triage)}`}>
                        {r.triage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {records.map((r) => (
              <div key={r.id} className="rounded-xl border border-stone-700/60 bg-stone-700/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-fluid-xs text-stone-400">{formatDate(r.created_at)}</span>
                  <span className={`text-fluid-lg font-bold ${scoreColor(r.score)}`}>{r.score}<span className="text-fluid-xs text-stone-500">/100</span></span>
                </div>
                <p className="text-fluid-sm font-medium text-stone-300 mb-2">
                  {r.intake_mode === 'Voice Check-In' ? '🎙' : '✍'} {r.intake_mode}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-fluid-xs font-semibold border ${triageColor(r.triage)}`}>
                  {r.triage}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
