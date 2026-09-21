import type { DistressResult } from '@/lib/distressEngine';

export default function DiagnosticsChart({ result }: { result: DistressResult }) {
  const { waveform, pitches } = result;

  const wPoints = waveform.length > 0
    ? waveform.map((v, i) => `${(i / (waveform.length - 1)) * 100},${50 + v * 45}`).join(' ')
    : '';

  const validPitches = pitches.filter((p) => p > 0);
  const maxPitch = Math.max(...validPitches, 300);
  const pPoints = pitches.length > 0
    ? pitches.map((p, i) => {
      const x = (i / (pitches.length - 1)) * 100;
      const y = 100 - (p / maxPitch) * 90;
      return `${x},${y}`;
    }).join(' ')
    : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Waveform */}
      <div className="bg-stone-900 rounded-xl p-3 sm:p-4 border border-stone-700/50">
        <p className="text-fluid-xs font-semibold text-sky-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Time-Domain Acoustic Waveform
        </p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24 sm:h-32">
          <polyline
            points={wPoints}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Pitch jitter */}
      <div className="bg-stone-900 rounded-xl p-3 sm:p-4 border border-stone-700/50">
        <p className="text-fluid-xs font-semibold text-rose-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          Pitch Jitter Variance (Hz)
        </p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24 sm:h-32">
          <polyline
            points={pPoints}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
