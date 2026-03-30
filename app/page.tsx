'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PostCard from '@/components/PostCard';
import CakeScene from '@/components/CakeScene';
import FloatingHearts from '@/components/FloatingHearts';

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="birthday-app">
      <FloatingHearts />
      <div className="pattern-overlay" aria-hidden="true" />
      <div className="glow glow-left" aria-hidden="true" />
      <div className="glow glow-right" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="screen-stage"
          >
            <PostCard onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="screen-stage"
          >
            <CakeScene onBack={() => setOpened(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
