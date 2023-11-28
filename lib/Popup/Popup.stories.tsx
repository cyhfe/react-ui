import React from "react";
import { Popup } from ".";
import { motion, AnimatePresence } from "framer-motion";
export default {
  title: "Components/Popup",
};

export function PopupDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
        trigger
      </button>
      <Popup open={isOpen} anchor={triggerRef.current}>
        content
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
    <div>
      <button ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
        trigger
      </button>
      <Popup open={isOpen} anchor={triggerRef.current} withTransition>
        {({ open, handleExited, handleEnter }) => (
          <AnimatePresence>
            {open && (
              <motion.div
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
                content
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Popup>
    </div>
  );
}
