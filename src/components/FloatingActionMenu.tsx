"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
  triggerIcon?: React.ReactNode;
  triggerGradient?: string;
};

const FloatingActionMenu = ({
  options,
  className,
  triggerIcon = <Plus className="w-6 h-6" />,
  triggerGradient = "from-blue-600 via-purple-600 to-pink-600",
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      {/* Trigger Button with Gradient Border and Tooltip */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Button
          onClick={toggleMenu}
          className={cn(
            "relative w-20 h-20 md:w-24 md:h-15 rounded-full p-0 border-none overflow-visible",
            "shadow-[0_0_40px_rgba(59,130,246,0.6)] md:shadow-[0_0_50px_rgba(59,130,246,0.6)]",
            "hover:shadow-[0_0_60px_rgba(147,51,234,0.7)] hover:scale-110",
            "transition-all duration-300"
          )}
          style={{
            background: "transparent",
          }}
        >
          {/* Gradient Border Layer */}
          <div
            className={cn(
              "absolute inset-0 rounded-full p-[2px]",
              "bg-gradient-to-r",
              triggerGradient
            )}
          >
            {/* Inner Background */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md flex items-center justify-center">
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="text-white"
              >
                {triggerIcon}
              </motion.div>
            </div>
          </div>
        </Button>

        {/* Tooltip with Bright Gradient */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-1.5 rounded-md whitespace-nowrap backdrop-blur-md shadow-[0_0_20px_rgba(147,51,234,0.5)] z-[60]">
            {/* Gradient Background */}
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Content */}
            <span className="relative text-white font-semibold text-xs tracking-wide">CLICK HERE</span>

            {/* Arrow pointing down */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-500 rotate-45" />
          </div>
        )}

        {/* Menu Options - Positioned relative to button wrapper */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Animated Arrow pointing up */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-white z-40"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowUp className="w-6 h-6" />
                </motion.div>
              </motion.div>

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-10 z-50"
              >
                <div className="flex flex-col items-center gap-2">
                  {options.map((option, index) => {
                    // Alternate gradients for visual variety
                    const gradients = [
                      "from-orange-500 to-red-600", // Get Started
                      "from-emerald-500 to-teal-600", // View Gallery
                    ];

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                      >
                        <Button
                          onClick={option.onClick}
                          size="sm"
                          className={cn(
                            "flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl backdrop-blur-sm",
                            "bg-gradient-to-r",
                            gradients[index % gradients.length],
                            "hover:scale-105 hover:brightness-110 transition-all duration-200",
                            "text-white font-medium px-4 py-2"
                          )}
                        >
                          {option.Icon}
                          <span>{option.label}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingActionMenu;
