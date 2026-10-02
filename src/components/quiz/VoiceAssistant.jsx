import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, ExternalLink, Radio } from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function VoiceAssistant({
  question,
  currentIndex,
  totalQuestions,
  isAnswered,
  isCorrect,
  correctOptionText,
  explanation,
  onSelectOption,
  onNext,
  referralUrl = 'https://wisprflow.ai/r?SANSKREETI1',
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Voice mode is off');

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isAnsweredRef = useRef(isAnswered);
  isAnsweredRef.current = isAnswered;

  // Speak helper
  const speakText = useCallback((text, onComplete) => {
    if (!synthRef.current || typeof window === 'undefined') return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      synthRef.current.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Initialize Speech Recognition
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setStatusMessage('Speech recognition not supported in this browser. Use Chrome or Edge.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setStatusMessage("Listening... Say 'Option A', 'Mars', or the answer!");
      };

      rec.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.warn('[VoiceAssistant] Speech error:', e.error);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim().toLowerCase();
        setTranscript(text);
        setStatusMessage(`Heard: "${text}"`);

        // Check if user said "next" or "continue"
        if (isAnsweredRef.current) {
          if (text.includes('next') || text.includes('continue') || text.includes('advance')) {
            onNext();
            return;
          }
        }

        // If not yet answered, parse answer
        if (!isAnsweredRef.current && question) {
          // Check letter matches
          if (text === 'a' || text.includes('option a') || text.startsWith('a ')) {
            onSelectOption(0);
            return;
          }
          if (text === 'b' || text.includes('option b') || text.startsWith('b ')) {
            onSelectOption(1);
            return;
          }
          if (text === 'c' || text.includes('option c') || text.startsWith('c ')) {
            onSelectOption(2);
            return;
          }
          if (text === 'd' || text.includes('option d') || text.startsWith('d ')) {
            onSelectOption(3);
            return;
          }

          // Check number matches
          if (text.includes('1') || text.includes('one') || text.includes('first')) {
            onSelectOption(0);
            return;
          }
          if (text.includes('2') || text.includes('two') || text.includes('second')) {
            onSelectOption(1);
            return;
          }
          if (text.includes('3') || text.includes('three') || text.includes('third')) {
            onSelectOption(2);
            return;
          }
          if (text.includes('4') || text.includes('four') || text.includes('fourth')) {
            onSelectOption(3);
            return;
          }

          // Check direct content matching
          for (let i = 0; i < question.options.length; i++) {
            const opt = question.options[i].toLowerCase();
            if (text.includes(opt) || opt.includes(text)) {
              onSelectOption(i);
              return;
            }
          }

          // Repeat command
          if (text.includes('repeat') || text.includes('again') || text.includes('read')) {
            readCurrentQuestion();
          }
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn('[VoiceAssistant] Speech recognition start error:', err);
    }
  }, [question, onSelectOption, onNext]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Read current question out loud
  const readCurrentQuestion = useCallback(() => {
    if (!question) return;
    const qNum = currentIndex + 1;
    const prompt = `Question ${qNum} of ${totalQuestions}. ${question.question}. ` +
      question.options.map((opt, i) => `Option ${OPTION_LETTERS[i]}: ${opt}`).join('. ');

    setStatusMessage(`Speaking Question ${qNum}...`);
    speakText(prompt, () => {
      setStatusMessage("Listening... Speak your answer (e.g. 'Option B' or 'Mars')");
      if (voiceEnabled) {
        startListening();
      }
    });
  }, [question, currentIndex, totalQuestions, speakText, voiceEnabled, startListening]);

  // Read feedback when answered
  useEffect(() => {
    if (!voiceEnabled || !isAnswered || !question) return;

    if (isCorrect) {
      const text = `Correct! Fantastic job, you earned 100 XP! Say Next to continue.`;
      setStatusMessage('🎉 Correct! Say "Next" to continue');
      speakText(text, () => {
        if (voiceEnabled) startListening();
      });
    } else {
      const correctLetter = OPTION_LETTERS[question.correctAnswer];
      const text = `Not quite! The correct answer is Option ${correctLetter}: ${correctOptionText}. ${explanation || ''}. Say Next to continue.`;
      setStatusMessage(`💡 Correct answer is ${correctLetter}. Say "Next" to continue`);
      speakText(text, () => {
        if (voiceEnabled) startListening();
      });
    }
  }, [isAnswered, isCorrect, question, correctOptionText, explanation, voiceEnabled, speakText, startListening]);

  // Auto-read next question when currentIndex changes if voiceEnabled
  useEffect(() => {
    if (voiceEnabled && !isAnswered && question) {
      readCurrentQuestion();
    }
  }, [currentIndex, voiceEnabled]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, [stopSpeaking, stopListening]);

  const toggleVoiceMode = () => {
    if (voiceEnabled) {
      setVoiceEnabled(false);
      stopSpeaking();
      stopListening();
      setStatusMessage('Voice mode disabled');
    } else {
      setVoiceEnabled(true);
      setStatusMessage('Voice mode active! Speaking question...');
      readCurrentQuestion();
    }
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-50 via-indigo-50/50 to-blue-50 border border-violet-100 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Voice Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleVoiceMode}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all shadow-xs ${
              voiceEnabled
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-200 ring-2 ring-violet-400'
                : 'bg-white text-ink border border-slate-200 hover:border-violet-300'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Mic className="w-4 h-4 text-white animate-pulse" />
                <span>Voice-to-Voice ON</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-body" />
                <span>Turn ON Voice Mode</span>
              </>
            )}
          </button>

          {voiceEnabled && (
            <button
              type="button"
              onClick={readCurrentQuestion}
              disabled={isSpeaking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-violet-700 hover:bg-violet-50 border border-violet-200 transition-colors disabled:opacity-50"
              title="Repeat question"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>
          )}
        </div>

        {/* Whispr Flow Attribution & Referral Link */}
        <a
          href={referralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-violet-200/80 transition-colors shadow-2xs group"
          title="Try Whispr Flow voice dictation"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Voice Powered by <strong className="font-extrabold underline decoration-violet-400">Whispr Flow</strong></span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-violet-600" />
        </a>
      </div>

      {/* Voice Status & Live Indicator */}
      {voiceEnabled && (
        <div className="mt-3 pt-3 border-t border-violet-100/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-violet-900 font-semibold">
            {isSpeaking ? (
              <span className="flex items-center gap-1.5 text-violet-600 font-bold">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span>Reading question aloud...</span>
              </span>
            ) : isListening ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                <span>Listening for your answer...</span>
              </span>
            ) : (
              <span className="text-slate-500">{statusMessage}</span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
            💬 Speak: <strong className="text-ink">"Option A"</strong>, <strong className="text-ink">"Mars"</strong>, or <strong className="text-ink">"Next"</strong>
          </div>
        </div>
      )}
    </div>
  );
}
