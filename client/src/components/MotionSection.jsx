import React from 'react';
import { motion } from 'framer-motion';

export default function MotionSection({ children, className = '', delay = 0, y = 30, threshold = 0.18, ...props }) {
  const variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.8, 0.36, 1], delay } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
