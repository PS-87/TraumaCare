import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Shield, Lock, UserPlus, LogIn, AlertCircle, Activity, Eye } from 'lucide-react';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [caseId, setCaseId] = useState('CR-2026-WB-092');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('Please enter your full name or pseudonym.');
      return;
    }

    setBusy(true);
    if (mode === 'login') {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error === 'Invalid login credentials' ? 'Authentication failed. Please verify credentials.' : error);
    } else {
      const { error } = await signUp(email.trim(), password, fullName.trim(), caseId.trim());
      if (error) {
        setError(error);
      } else {
        setError(null);
        setMode('login');
        setEmail('');
        setPassword('');
        setFullName('');
        alert('Protected profile registered. You may now sign in.');
      }
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-stone-950">
      {/* Left brand panel — warm dark gradient */}
      <div className="lg:w-1/2 bg-gradient-to-br from-stone-900 via-stone-950 to-blue-950/40 px-6 py-10 sm:px-10 lg:py-20 lg:px-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-8 right-8 sm:top-10 sm:right-10 opacity-5">
          <Activity className="w-40 h-40 sm:w-64 sm:h-64 text-sky-400" strokeWidth={1} />
        </div>
        <div className="absolute bottom-16 left-8 sm:bottom-20 sm:left-10 opacity-5">
          <Shield className="w-32 h-32 sm:w-48 sm:h-48 text-sky-300" strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-fluid-xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              TraumaCare VR
            </h1>
          </div>

          <h2 className="text-fluid-2xl font-bold text-stone-100 leading-tight mb-4">
            Witness Gateway
          </h2>
          <p className="text-stone-400 text-fluid-sm mb-8 leading-relaxed">
            Confidential dynamic risk & acoustic distress monitoring network.
            AI-powered triage, bio-acoustic analysis, and immersive VR grounding for protected witnesses.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-stone-100 text-fluid-sm font-semibold">Zero-Retention Privacy Protocol</p>
                <p className="text-stone-500 text-fluid-xs mt-0.5">Voice audio is processed locally and discarded immediately after parameter extraction.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-stone-100 text-fluid-sm font-semibold">Multimodal Stress Modeling</p>
                <p className="text-stone-500 text-fluid-xs mt-0.5">Linguistic NLP pipelines and acoustic pitch-jitter tracking for distress scoring.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Eye className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-stone-100 text-fluid-sm font-semibold">Judicial Acclimatization</p>
                <p className="text-stone-500 text-fluid-xs mt-0.5">Dynamic linkage with immersive VR courtroom and SOS grounding modules.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right auth form — warm dark card */}
      <div className="lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-6 lg:py-20 bg-stone-900">
        <div className="w-full max-w-md">
          <div className="bg-stone-800/80 rounded-2xl shadow-xl border border-stone-700/60 p-6 sm:p-8">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-stone-700/50 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-fluid-sm font-semibold transition-all ${
                  mode === 'login' ? 'bg-stone-600 text-sky-400 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-fluid-sm font-semibold transition-all ${
                  mode === 'register' ? 'bg-stone-600 text-sky-400 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Register
              </button>
            </div>

            <h2 className="text-fluid-lg font-bold text-stone-100 mb-1">
              {mode === 'login' ? 'Authenticate & Enter Portal' : 'Register Protected Identity'}
            </h2>
            <p className="text-fluid-sm text-stone-400 mb-6">
              {mode === 'login' ? 'Enter your credentials to access the triage dashboard.' : 'Create a witness profile for triage access.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
                    Full Name / Pseudonym
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                  placeholder="witness@gateway"
                />
              </div>

              <div>
                <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
                  Security Key / Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-fluid-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wide">
                    Assigned Case Reference ID
                  </label>
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-600 bg-stone-700/50 text-fluid-sm text-stone-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all font-mono"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-fluid-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-fluid-sm hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? 'Processing...' : mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}
              </button>
            </form>
          </div>

          <p className="text-center text-fluid-xs text-stone-500 mt-6">
            Confidential system • Authorized access only • Session activity is monitored
          </p>
        </div>
      </div>
    </div>
  );
}
