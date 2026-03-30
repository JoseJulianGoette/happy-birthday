'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  onOpen: () => void;
}

const letterLines = [
  { type: 'p', text: 'Heute ist dein Geburtstag und ich möchte dir von ganzem Herzen gratulieren.' },
  { type: 'p', text: 'Es ist so schön zu sehen, wie du dich entwickelt hast und ich bin so so stolz auf dich.' },
  { type: 'p', text: 'jetzt bist du endlich 21 und ich freue mich so sehr, dass wir diesen besonderen Tag zusammen feiern.' },
  { type: 'p', text: 'Auf noch viele tausend weitere Geburtstage.' },
  { type: 'p', text: 'Ich liebe dich.' },
  { type: 'strong', text: 'José' },
];

function Typewriter({
  text,
  startDelay,
  speed = 35,
  onDone,
  Tag = 'p',
}: {
  text: string;
  startDelay: number;
  speed?: number;
  onDone?: () => void;
  Tag?: 'p' | 'strong';
}) {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (visible >= text.length) {
      onDone?.();
      return;
    }
    const timer = setTimeout(() => setVisible((count) => count + 1), speed);
    return () => clearTimeout(timer);
  }, [started, visible, text.length, speed, onDone]);

  if (!started) return <Tag className="typewriter-line">&nbsp;</Tag>;

  return (
    <Tag className="typewriter-line">
      {text.slice(0, visible)}
      {visible < text.length && <span className="typewriter-cursor">|</span>}
    </Tag>
  );
}

export default function PostCard({ onOpen }: PostCardProps) {
  const [opened, setOpened] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [coverDetached, setCoverDetached] = useState(false);

  const lineDelays = useMemo(() => {
    const delays: number[] = [];
    let cumulative = 950;

    for (const line of letterLines) {
      delays.push(cumulative);
      cumulative += line.text.length * 35 + 380;
    }

    return delays;
  }, []);

  useEffect(() => {
    if (!opened) {
      setCoverDetached(false);
      return;
    }

    const detachTimer = window.setTimeout(() => {
      setCoverDetached(true);
    }, 180);

    const scrollTimer = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);

    return () => {
      window.clearTimeout(detachTimer);
      window.clearTimeout(scrollTimer);
    };
  }, [opened]);

  return (
    <div className={`experience-card postcard-stage ${opened ? 'is-opened-stage' : ''}`}>
      <div className={`flip-scene ${opened ? 'is-opened' : ''}`}>
        <div className={`card-open-scene ${opened ? 'is-opened' : ''}`}>
          <motion.div
            className={`card-cover-wrapper ${coverDetached ? 'is-detached' : ''}`}
            initial={false}
            animate={{
              opacity: opened ? 0 : 1,
              y: opened ? -28 : 0,
              scale: opened ? 0.97 : 1,
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ pointerEvents: opened ? 'none' : 'auto' }}
          >
            <button
              type="button"
              className="card-3d card-front"
              onClick={() => !opened && setOpened(true)}
              style={{ cursor: opened ? 'default' : 'pointer' }}
            >
              <div className="card-badge">31 März</div>
              <div className="card-cover-art">
                <img src="/panda.svg" alt="Panda" className="card-panda" />
              </div>
              <p className="card-eyebrow">Geburtstagskarte</p>
              <h1 className="card-title">Für Benita</h1>
              <p className="card-subtitle">Tippen um die Karte zu öffnen</p>
              <div className="card-tap-hint">
                <span className="tap-icon">&#8599;</span>
              </div>
            </button>
          </motion.div>

          <motion.div
            className="card-inside-content"
            initial={false}
            animate={{
              opacity: opened ? 1 : 0,
              y: opened ? 0 : 14,
            }}
            transition={{ delay: opened ? 0.12 : 0, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: opened ? 'auto' : 'none' }}
          >
            <div className="card-inside-paper">
              <motion.img
                src="/panda.svg"
                alt="Panda"
                className="inside-panda-small"
                initial={false}
                animate={{ opacity: opened ? 1 : 0, scale: opened ? 1 : 0.6 }}
                transition={{ delay: 0.42, duration: 0.4 }}
                style={{ display: 'block', margin: '0 auto 20px' }}
              />

              <motion.p
                className="letter-eyebrow"
                initial={false}
                animate={{ opacity: opened ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.28 }}
              >
                Nur für dich
              </motion.p>

              <motion.h2
                className="letter-title"
                initial={false}
                animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 6 }}
                transition={{ delay: 0.56, duration: 0.34 }}
              >
                Alles Gute zum Geburtstag mein Ein und Alles
              </motion.h2>

              <div className="letter-date-row" />

              <div className="letter-body">
                {opened &&
                  letterLines.map((line, i) => (
                    <Typewriter
                      key={i}
                      text={line.text}
                      startDelay={lineDelays[i]}
                      speed={35}
                      Tag={line.type as 'p' | 'strong'}
                      onDone={i === letterLines.length - 1 ? () => setAllDone(true) : undefined}
                    />
                  ))}
              </div>
            </div>

            <AnimatePresence>
              {allDone && (
                <motion.button
                  type="button"
                  className="open-button"
                  onClick={onOpen}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <strong>Zur Geburtstagstorte</strong>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
