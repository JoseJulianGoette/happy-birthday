'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const FloatingHearts = () => {
  const hearts = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      drift: -18 + Math.random() * 36,
      duration: 8 + Math.random() * 6,
      size: 18 + Math.random() * 24,
      opacity: 0.14 + Math.random() * 0.22,
      progress: Math.random(),
    }));
  }, []);

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart absolute text-primary"
          style={{
            left: `${heart.x}%`,
            opacity: heart.opacity,
            willChange: 'transform',
          }}
          initial={{ y: '110vh', x: 0, rotate: -6 }}
          animate={{
            y: '-120vh',
            x: [0, heart.drift, 0],
            rotate: [-6, 4, -3],
          }}
          transition={{
            duration: heart.duration,
            delay: -(heart.duration * heart.progress),
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <img
            src="/ballon.svg"
            alt=""
            aria-hidden="true"
            className="floating-heart-icon drop-shadow-sm"
            style={{
              width: `${heart.size}px`,
              height: `${heart.size * 1.35}px`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
