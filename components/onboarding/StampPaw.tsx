"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StampPaw() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.6, rotate: -18, y: -120 }}
      animate={{ opacity: 1, scale: [1.6, 0.9, 1.05, 1], rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
      className="absolute bottom-32 right-6 z-20 pointer-events-none"
    >
      <Image
        src="/stamp.svg"
        alt="WanNya Approved"
        width={96}
        height={96}
        priority
        className="drop-shadow-xl"
      />
    </motion.div>
  );
}