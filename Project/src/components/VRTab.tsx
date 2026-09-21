import { useState } from 'react';
import { Waves, Scale } from 'lucide-react';

export default function VRTab() {
  const [module, setModule] = useState<'sanctuary' | 'courtroom'>('sanctuary');

  return (
    <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-fluid-lg">🥽</span>
        <h3 className="text-fluid-lg font-bold text-stone-100">Immersive VR Grounding & Acclimatization Modules</h3>
      </div>
      <p className="text-fluid-sm text-stone-400 mb-6">
        Prescribed immersive environments to regulate distress and alleviate courtroom anxiety.
      </p>

      {/* Module selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setModule('sanctuary')}
          className={`flex-1 flex items-start gap-3 p-3 sm:p-4 rounded-xl border transition-all text-left ${
            module === 'sanctuary'
              ? 'border-sky-500 bg-sky-950/30 shadow-md'
              : 'border-stone-700/60 bg-stone-700/30 hover:border-stone-600'
          }`}
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            module === 'sanctuary' ? 'bg-sky-500' : 'bg-stone-600'
          }`}>
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-fluid-sm font-bold text-stone-100">Module A: SOS Grounding Sanctuary</p>
            <p className="text-fluid-xs text-stone-400 mt-0.5">4-4-4-4 Box Breathing with bilateral audio stimulation</p>
          </div>
        </button>

        <button
          onClick={() => setModule('courtroom')}
          className={`flex-1 flex items-start gap-3 p-3 sm:p-4 rounded-xl border transition-all text-left ${
            module === 'courtroom'
              ? 'border-blue-500 bg-blue-950/30 shadow-md'
              : 'border-stone-700/60 bg-stone-700/30 hover:border-stone-600'
          }`}
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            module === 'courtroom' ? 'bg-blue-500' : 'bg-stone-600'
          }`}>
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-fluid-sm font-bold text-stone-100">Module B: Judicial Courtroom Simulator</p>
            <p className="text-fluid-xs text-stone-400 mt-0.5">Systematic desensitization & spatial familiarization (Sec 398 BNSS)</p>
          </div>
        </button>
      </div>

      {/* Module descriptions */}
      {module === 'sanctuary' && (
        <div className="mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-blue-950/30 border border-sky-900/40">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-sky-400" />
            <h4 className="text-fluid-sm font-bold text-stone-200">Module A: SOS Grounding Sanctuary</h4>
          </div>
          <ul className="text-fluid-xs text-stone-400 space-y-1 ml-6 list-disc">
            <li><strong>Technique:</strong> Bilateral audio stimulation, box-breathing guide (4-4-4-4).</li>
            <li><strong>Environment:</strong> Calming coastal horizon simulation with rhythmic visual pacing.</li>
          </ul>
        </div>
      )}

      {module === 'courtroom' && (
        <div className="mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border border-blue-900/40">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-4 h-4 text-blue-400" />
            <h4 className="text-fluid-sm font-bold text-stone-200">Module B: Judicial Courtroom Simulator</h4>
          </div>
          <ul className="text-fluid-xs text-stone-400 space-y-1 ml-6 list-disc">
            <li><strong>Technique:</strong> Systematic desensitization & spatial familiarization under Section 398 BNSS.</li>
            <li><strong>Environment:</strong> Realistic 3D witness box (katghara), judge's bench, and advocate stations.</li>
          </ul>
        </div>
      )}

      {/* VR iframe */}
      <div className="rounded-xl overflow-hidden border border-stone-700/60 shadow-inner">
        <iframe
          src={module === 'sanctuary' ? '/sanctuary.html' : '/courtroom.html'}
          className="w-full block"
          style={{ height: module === 'sanctuary' ? 'clamp(360px, 55vh, 480px)' : 'clamp(400px, 65vh, 580px)' }}
          title={module === 'sanctuary' ? 'VR Grounding Sanctuary' : 'VR Courtroom Simulator'}
        />
      </div>
    </div>
  );
}
