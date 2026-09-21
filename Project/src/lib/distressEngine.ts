// Distress scoring engine — mirrors the Python feature_engine logic.
// Uses Web Audio API for pitch jitter analysis and keyword/sentiment NLP heuristics.

export interface DistressFeatures {
  pitch_jitter: number;
  pause_ratio: number;
  trauma_keywords: number;
  negative_sentiment: number;
}

export interface DistressResult {
  score: number;
  triage: string;
  features: DistressFeatures;
  transcript: string;
  waveform: number[];
  pitches: number[];
}

const TRAUMA_KEYWORDS = [
  'fear', 'scared', 'threat', 'kill', 'danger', 'afraid', 'panic', 'attack',
  'hurt', 'death', 'weapon', 'gun', 'knife', 'blood', 'assault', 'abuse',
  'intimidat', 'coercion', 'harass', 'stalk', 'warning', 'dhamki', 'darr',
  'life', 'risk', 'unsafe', 'protect', 'help', 'police', 'escort',
];

const NEGATIVE_WORDS = [
  'anxious', 'terrified', 'nightmare', 'trauma', 'suffer', 'pain', 'cry',
  'helpless', 'hopeless', 'desperate', 'severe', 'urgent', 'cannot', 'unable',
  'watching', 'threatened', 'consequences', 'dire', 'coercion', 'intimidation',
];

export function analyzeText(text: string): { traumaKeywords: number; negativeSentiment: number } {
  const lower = text.toLowerCase();
  let traumaCount = 0;
  let negCount = 0;

  for (const kw of TRAUMA_KEYWORDS) {
    const matches = lower.match(new RegExp(kw, 'g'));
    if (matches) traumaCount += matches.length;
  }

  for (const nw of NEGATIVE_WORDS) {
    if (lower.includes(nw)) negCount++;
  }

  return { traumaKeywords: traumaCount, negativeSentiment: Math.min(negCount, 10) };
}

// Extract pitch contour from an AudioBuffer using autocorrelation
export function extractPitch(buffer: AudioBuffer): number[] {
  const channel = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const frameSize = 1024;
  const hop = 512;
  const pitches: number[] = [];

  for (let i = 0; i + frameSize < channel.length; i += hop) {
    const frame = channel.subarray(i, i + frameSize);
    let bestOffset = 0;
    let bestCorr = 0;
    const rms = Math.sqrt(frame.reduce((s, v) => s + v * v, 0) / frameSize);

    if (rms < 0.01) {
      pitches.push(0);
      continue;
    }

    for (let offset = 40; offset < 400; offset++) {
      let corr = 0;
      for (let j = 0; j < frameSize - offset; j++) {
        corr += frame[j] * frame[j + offset];
      }
      if (corr > bestCorr) {
        bestCorr = corr;
        bestOffset = offset;
      }
    }

    if (bestOffset > 0 && bestCorr > 0.1) {
      pitches.push(sampleRate / bestOffset);
    } else {
      pitches.push(0);
    }
  }

  return pitches;
}

function computePitchJitter(pitches: number[]): number {
  const valid = pitches.filter((p) => p > 50 && p < 500);
  if (valid.length < 3) return 8;

  let totalDiff = 0;
  for (let i = 1; i < valid.length; i++) {
    totalDiff += Math.abs(valid[i] - valid[i - 1]);
  }
  const avgJitter = totalDiff / (valid.length - 1);
  return Math.round(avgJitter * 100) / 100;
}

function computePauseRatio(pitches: number[]): number {
  if (pitches.length === 0) return 0.3;
  const silent = pitches.filter((p) => p === 0).length;
  return Math.round((silent / pitches.length) * 100) / 100;
}

export function computeDistressScore(
  audioBuffer: AudioBuffer | null,
  text: string,
  daysToHearing: number,
  threatFlag: number,
): DistressResult {
  const pitches = audioBuffer ? extractPitch(audioBuffer) : [];
  const waveform = audioBuffer
    ? Array.from(audioBuffer.getChannelData(0).filter((_, i) => i % Math.max(1, Math.floor(audioBuffer.length / 400)) === 0))
    : [];

  const pitchJitter = computePitchJitter(pitches);
  const pauseRatio = computePauseRatio(pitches);
  const { traumaKeywords, negativeSentiment } = analyzeText(text || 'Neutral statement');

  // Weighted scoring model (mirrors the Python implementation)
  const jitterScore = Math.min(pitchJitter * 4, 25);
  const pauseScore = Math.min(pauseRatio * 30, 20);
  const keywordScore = Math.min(traumaKeywords * 5, 25);
  const sentimentScore = Math.min(negativeSentiment * 2.5, 15);
  const proximityScore = Math.max(0, (14 - daysToHearing) * 1.5);
  const threatScore = threatFlag * 15;

  const rawScore = jitterScore + pauseScore + keywordScore + sentimentScore + proximityScore + threatScore;
  const score = Math.min(Math.round(rawScore), 100);

  let triage: string;
  if (score >= 60) {
    triage = 'RED — Critical Intervention';
  } else if (score >= 30) {
    triage = 'YELLOW — Elevated Distress';
  } else {
    triage = 'GREEN — Stable Baseline';
  }

  return {
    score,
    triage,
    features: {
      pitch_jitter: pitchJitter,
      pause_ratio: pauseRatio,
      trauma_keywords: traumaKeywords,
      negative_sentiment: negativeSentiment,
    },
    transcript: text || 'Statement not provided.',
    waveform,
    pitches,
  };
}
