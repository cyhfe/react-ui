import React from "react";
import { Popup } from ".";
import { motion, AnimatePresence } from "framer-motion";
export default {
  title: "Components/Popup",
};

export function Base() {
  const [isOpen, setIsOpen] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex justify-center items-center">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-black rounded px-2 py-1"
      >
        trigger
      </button>
      <Popup
        open={isOpen}
        anchor={triggerRef.current}
        className="p-2 shadow max-w-sm border rounded"
      >
        Ut aliquip esse ipsum nisi.
      </Popup>
    </div>
  );
}

export function KeepMounted() {
  const [isOpen, setIsOpen] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex justify-center items-center">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-black rounded px-2 py-1"
      >
        trigger
      </button>
      <Popup
        keepMounted
        open={isOpen}
        anchor={triggerRef.current}
        className="p-2 shadow max-w-sm border rounded"
      >
        Ut aliquip esse ipsum nisi.
      </Popup>
    </div>
  );
}

export function Animation() {
  const [isOpen, setIsOpen] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <div className="flex justify-center items-center">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-black rounded px-2 py-1"
      >
        trigger
      </button>
      <Popup open={isOpen} anchor={triggerRef.current} withTransition>
        {({ open, handleExited, handleEnter }) => (
          <AnimatePresence>
            {open && (
              <motion.div
                className="p-2 shadow max-w-sm border rounded"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                onAnimationComplete={(definition) => {
                  if (definition === "hidden") {
                    handleExited();
                  }
                }}
                onAnimationStart={(definition) => {
                  if (definition === "visible") {
                    handleEnter();
                  }
                }}
              >
                Ut Lorem occaecat amet pariatur qui nostrud est minim cupidatat
                nostrud in ullamco.
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Popup>
    </div>
  );
}
