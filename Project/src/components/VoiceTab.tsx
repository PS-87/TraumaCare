import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Play, Zap } from 'lucide-react';
import { computeDistressScore, type DistressResult } from '@/lib/distressEngine';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import TriageDashboard from './TriageDashboard';
import DiagnosticsChart from './DiagnosticsChart';

interface VoiceTabProps {
  daysToHearing: number;
  threatFlag: number;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function VoiceTab({ daysToHearing, threatFlag }: VoiceTabProps) {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DistressResult | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function getAudioContext(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  async function startRecording() {
    setListening(true);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const arrayBuf = await blob.arrayBuffer();
        const ctx = getAudioContext();
        try {
          const decoded = await ctx.decodeAudioData(arrayBuf);
          setAudioBuffer(decoded);
        } catch {
          setAudioBuffer(null);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        let finalText = '';
        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setTranscript((finalText + interim).trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error('Mic access error:', err);
      setListening(false);
      alert('Microphone access denied. Please allow microphone permissions and try again.');
    }
  }

  function stopRecording() {
    setListening(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  }

  async function evaluateVoice() {
    setAnalyzing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 200));

    const text = transcript.trim() || 'Statement not provided.';
    const res = computeDistressScore(audioBuffer, text, daysToHearing, threatFlag);
    setResult(res);

    if (user) {
      await supabase.from('sessions').insert({
        user_id: user.id,
        intake_mode: 'Voice Check-In',
        score: res.score,
        triage: res.triage,
        transcript: res.transcript,
        features: res.features,
      });
    }

    setAnalyzing(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Left: Recording panel */}
      <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 p-4 sm:p-6">
        <h3 className="text-fluid-lg font-bold text-stone-100 mb-1">Live Acoustic Check-In</h3>
        <p className="text-fluid-sm text-stone-400 mb-6">
          Record your statement. Your speech will be automatically transcribed and analyzed for bio-acoustic distress markers.
        </p>

        {/* Mic button */}
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={listening ? stopRecording : startRecording}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
              listening
                ? 'bg-red-500 shadow-red-500/40 animate-pulse'
                : 'bg-gradient-to-br from-sky-500 to-blue-700 shadow-sky-500/30 hover:scale-105'
            }`}
          >
            {listening ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          </button>
          <p className="text-fluid-sm font-semibold text-stone-300 mt-3">
            {listening ? 'Recording... Click to stop' : 'Click to start recording'}
          </p>
          {listening && (
            <div className="flex items-center gap-1 mt-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-red-400 animate-pulse"
                  style={{ height: `${8 + Math.random() * 20}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transcript */}
        <div className="mb-4">
          <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
            Transcribed Statement (Editable)
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none"
            placeholder="Your transcribed speech will appear here. You can also type directly..."
          />
        </div>

        <button
          onClick={evaluateVoice}
          disabled={analyzing || (!transcript.trim() && !audioBuffer)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-fluid-sm hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing bio-acoustics...</>
          ) : (
            <><Zap className="w-4 h-4" /> Evaluate Voice Intake</>
          )}
        </button>
      </div>

      {/* Right: Results */}
      <div>
        {!result && !analyzing && (
          <div className="bg-stone-800/40 rounded-2xl border border-dashed border-stone-700 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-stone-600 mb-3" />
            <p className="text-stone-500 text-fluid-sm">Record a voice statement and click "Evaluate" to see your distress triage results.</p>
          </div>
        )}

        {analyzing && (
          <div className="bg-stone-800/40 rounded-2xl border border-stone-700/60 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-3" />
            <p className="text-stone-300 text-fluid-sm font-medium">Extracting bio-acoustics & calculating distress score...</p>
          </div>
        )}

        {result && !analyzing && (
          <div className="space-y-4">
            <TriageDashboard result={result} />

            <div className="bg-stone-800/80 rounded-2xl shadow-lg border border-stone-700/60 p-4 sm:p-5">
              <h4 className="text-fluid-sm font-bold text-stone-200 mb-3">Bio-Acoustic Diagnostics & Transcription</h4>
              {result.transcript && result.transcript !== 'Statement not provided.' ? (
                <div className="px-4 py-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 mb-4">
                  <p className="text-fluid-sm text-emerald-300">
                    <span className="font-semibold">Processed Statement:</span> "{result.transcript}"
                  </p>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-lg bg-amber-950/30 border border-amber-900/40 mb-4">
                  <p className="text-fluid-sm text-amber-300">No transcript detected. Check microphone permissions or input audio level.</p>
                </div>
              )}
              <DiagnosticsChart result={result} />
            </div>

            {result.triage.includes('RED') && (
              <div className="bg-stone-800/80 rounded-2xl shadow-lg border-2 border-red-900/50 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-5 h-5 text-red-400" />
                  <h4 className="text-fluid-sm font-bold text-red-300">Immediate Intervention: 360° Grounding Sanctuary</h4>
                </div>
                <p className="text-fluid-xs text-stone-400 mb-3">Autonomic regulation recommended immediately based on elevated distress score.</p>
                <iframe src="/sanctuary.html" className="w-full rounded-xl border border-stone-700/60" style={{ height: 'clamp(320px, 50vh, 480px)' }} title="VR Sanctuary" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
