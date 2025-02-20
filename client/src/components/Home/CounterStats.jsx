import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Counter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 3000; // Slower Animation (3 seconds)
    const stepTime = Math.abs(Math.floor(duration / value));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === value) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="text-5xl font-extrabold text-[#A53030]">{count}+</span>;
};

const CounterStats = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
        
        {/* Customers */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <Counter value={500} />
          <p className="text-gray-700 text-lg mt-1">Happy Customers</p>
        </motion.div>

        {/* Professionals */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <Counter value={50} />
          <p className="text-gray-700 text-lg mt-1">Expert Professionals</p>
        </motion.div>

        {/* Years in Business */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          <Counter value={5} />
          <p className="text-gray-700 text-lg mt-1">Years in Business</p>
        </motion.div>

      </div>
    </section>
  );
};

export default CounterStats;
