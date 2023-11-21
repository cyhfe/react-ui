import { ReactNode, useState } from "react";
import {
  Modal,
  useModal,
  ModalOverlay,
  ModalTrigger,
  ModalContent,
  ModalPortal,
  ModalClose,
} from "../";

import { motion, AnimatePresence } from "framer-motion";

export default { title: "Components/Modal" };

export function Portal() {
  return (
    <Modal>
      <ModalTrigger>
        <button className="border rounded px-2 py-1 bg-black text-white">
          trigger
        </button>
      </ModalTrigger>
      <ModalPortal>
        <ModalOverlay>
          <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 flex items-center justify-center">
            <ModalContent className="bg-white rounded w-1/5 p-6">
              <div className="mb-2">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry.
              </div>
              <div className="flex justify-end">
                <ModalClose>
                  <button className="border rounded px-2 py-1 bg-red-500 text-white">
                    close
                  </button>
                </ModalClose>
              </div>
            </ModalContent>
          </div>
        </ModalOverlay>
      </ModalPortal>
    </Modal>
  );
}

export function Animation() {
  const [toggle, setToggle] = useState(false);
  return (
    <Modal open={toggle} onOpenChange={setToggle}>
      <ModalTrigger>
        <button className="border rounded px-2 py-1 bg-black text-white">
          trigger
        </button>
      </ModalTrigger>
      <ModalOverlay
        render={({ open, clickToClose }) => {
          return (
            <AnimatePresence>
              {open && (
                <motion.div
                  className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={clickToClose}
                >
                  <ModalContent className="bg-white rounded w-1/5 p-6">
                    <div className="mb-2">
                      What is Lorem Ipsum? Lorem Ipsum is simply dummy text of
                      the printing and typesetting industry.
                    </div>
                    <div className="flex justify-end">
                      <ModalClose>
                        <button className="border rounded px-2 py-1 bg-red-500 text-white">
                          close
                        </button>
                      </ModalClose>
                    </div>
                  </ModalContent>
                </motion.div>
              )}
            </AnimatePresence>
          );
        }}
      ></ModalOverlay>
    </Modal>
  );
}
