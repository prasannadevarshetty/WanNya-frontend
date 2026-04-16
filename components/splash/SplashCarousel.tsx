"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { slides as slideImages } from "@/lib/onboardingData";
import { useTranslations } from "next-intl";

export default function SplashCarousel() {
  const [index, setIndex] = useState(0);
  const t = useTranslations('welcome');
  const slidesContent = t.raw('slides');

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card wrapper – allows stamp overflow */}
      <div className="relative w-[320px] h-[345px]">
        {/* Paw Stamp */}
        <img
          src="/stamp.png"
          alt="Paw Stamp"
          className="absolute -top-5 -right-5 w-14 z-20"
        />

        {/* Card body */}
        <div
          className="
            w-full
            h-full
            bg-[#fff4c7]
            border-4 border-[#d4a017]
            rounded-[32px]
            px-6
            py-8
            text-center
            flex
            flex-col
            justify-center
            overflow-hidden
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Image */}
              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 flex items-center justify-center">
                  <img
                    src={slideImages[index].image}
                    alt={slidesContent[index].title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#d4a017]">
                {slidesContent[index].title}
              </h2>

              <p className="mt-2 text-sm font-medium text-[#f1b800]">
                {slidesContent[index].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-4">
        {slideImages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-8 rounded-full transition ${
              i === index ? "bg-[#f1b800]" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
