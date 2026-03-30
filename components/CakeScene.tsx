'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CAKE_STAGES = [7, 8, 9, 10] as const;

function Cake({
  stage,
  micDenied,
  onAdvance,
}: {
  stage: number;
  micDenied: boolean;
  onAdvance: () => void;
}) {
  return (
    <button
      type="button"
      className={`cake-figure-button ${micDenied ? 'is-clickable' : ''}`}
      onClick={micDenied ? onAdvance : undefined}
      aria-label={micDenied ? 'Torte antippen' : 'Geburtstagstorte'}
    >
      <div className="cake-figure-stack">
        {CAKE_STAGES.map((stageNumber, index) => {
          const isActive = stageNumber === stage;
          const isPassed = index < CAKE_STAGES.indexOf(stage as (typeof CAKE_STAGES)[number]);

          return (
            <motion.img
              key={stageNumber}
              src={`/Group ${stageNumber}.svg`}
              alt={isActive ? `Torte Stufe ${stageNumber}` : ''}
              aria-hidden={isActive ? undefined : true}
              className={`cake-figure-image ${isActive ? 'is-active' : ''}`}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : isPassed ? 1.01 : 0.99,
                filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </div>
    </button>
  );
}

export default function CakeScene({ onBack }: { onBack: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [micState, setMicState] = useState<'idle' | 'asking' | 'on' | 'denied'>('idle');
  const [allOut, setAllOut] = useState(false);
  const animRef = useRef<number | null>(null);
  const coolRef = useRef(false);

  const advanceStage = useCallback(() => {
    if (coolRef.current || allOut) {
      return;
    }

    coolRef.current = true;
    window.setTimeout(() => {
      coolRef.current = false;
    }, 900);

    setStageIndex((prev) => {
      const next = Math.min(prev + 1, CAKE_STAGES.length - 1);
      if (next === CAKE_STAGES.length - 1) {
        window.setTimeout(() => setAllOut(true), 550);
      }
      return next;
    });
  }, [allOut]);

  const startMic = useCallback(async () => {
    setMicState('asking');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        setMicState('denied');
        return;
      }

      const context = new AudioContextClass();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      setMicState('on');

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(buffer);
        const average = buffer.reduce((sum, value) => sum + value, 0) / buffer.length;

        if (average > 34) {
          advanceStage();
        }

        animRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch {
      setMicState('denied');
    }
  }, [advanceStage]);

  useEffect(() => {
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!allOut) {
      return;
    }

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff6b6b', '#ff9a9e', '#fad0c4', '#ffecd2', '#ff85a2'],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff6b6b', '#ff9a9e', '#fad0c4', '#ffecd2', '#ff85a2'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#ff9a9e', '#fad0c4', '#ffecd2'],
    });

    frame();
  }, [allOut]);

  const currentStage = CAKE_STAGES[stageIndex];
  const remaining = CAKE_STAGES.length - 1 - stageIndex;

  return (
    <div className="experience-card postcard-stage">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="cake-stage"
      >
        <div className="letter-header cake-header">
          <h2>{allOut ? 'Wünsch dir etwas' : 'Puste und mach die kerzen aus'}</h2>
          <p className="cake-subline">
            {allOut
              ? 'alle kerzen sind aus, hoffentlich hast du dir was gewünscht.'
              : micState === 'on'
              ? `es brennen noch kerzen,du musst alle auspusten. Noch ${remaining} Pusten.`
              : micState === 'denied'
              ? 'Mikrofon blockiert. Tippe auf die Torte, um fortzufahren.'
              : 'Starte das Mikrofon und puste in dein Gerät, um die Kerzen auszublasen.'}
          </p>
        </div>

        <div className="cake-panel cake-panel-postcard">
          <Cake stage={currentStage} micDenied={micState === 'denied'} onAdvance={advanceStage} />
        </div>

        <AnimatePresence mode="wait">
          
            <motion.button
              key="mic"
              type="button"
              className="mic-button"
              onClick={startMic}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Kerzen auspusten
            </motion.button>
          

          {!allOut && micState === 'asking' && (
            <motion.p
              key="asking"
              className="status-text"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              Mikrofon wird angefragt...
            </motion.p>
          )}

          
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
