import { PopupRoot, PopupTrigger, PopupContent } from ".";
import { motion, AnimatePresence } from "framer-motion";
export default {
  title: "Components/Popup",
};

export function Base() {
  return (
    // after(radix pattern)
    <PopupRoot className="flex justify-center items-center">
      <PopupTrigger className="border border-black rounded px-2 py-1">
        <div>trigger</div>
      </PopupTrigger>
      <PopupContent className="p-2 shadow max-w-sm border rounded">
        Ut aliquip esse ipsum nisi.
      </PopupContent>
    </PopupRoot>

    // before(mui pattern)
    // <div className="flex justify-center items-center">
    //   <button
    //     ref={triggerRef}
    //     onClick={() => setIsOpen((prev) => !prev)}
    //     className="border border-black rounded px-2 py-1"
    //   >
    //     trigger
    //   </button>
    //   <Popup
    //     open={isOpen}
    //     anchor={triggerRef.current}
    //     className="p-2 shadow max-w-sm border rounded"
    //   >
    //     Ut aliquip esse ipsum nisi.
    //   </Popup>
    // </div>
  );
}

export function Placement() {
  return (
    // after(radix pattern)
    <PopupRoot className="flex justify-center items-center">
      <PopupTrigger className="border border-black rounded px-2 py-1">
        <div>trigger</div>
      </PopupTrigger>
      <PopupContent
        className="p-2 shadow max-w-sm border rounded"
        placement="left"
      >
        Ut aliquip esse ipsum nisi.
      </PopupContent>
    </PopupRoot>
  );
}

export function KeepMounted() {
  return (
    <PopupRoot className="flex justify-center items-center">
      <PopupTrigger className="border border-black rounded px-2 py-1">
        <div>trigger</div>
      </PopupTrigger>
      <PopupContent className="p-2 shadow max-w-sm border rounded" keepMounted>
        Ut aliquip esse ipsum nisi.
      </PopupContent>
    </PopupRoot>
  );
}

export function Animation() {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <PopupRoot className="flex justify-center items-center">
      <PopupTrigger className="border border-black rounded px-2 py-1">
        <div>trigger</div>
      </PopupTrigger>
      <PopupContent withTransition>
        {({ isOpen, handleExited, handleEnter }) => (
          <AnimatePresence>
            {isOpen && (
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
      </PopupContent>
    </PopupRoot>
  );
}
