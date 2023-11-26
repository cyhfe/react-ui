import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalTrigger,
  ModalContent,
  ModalPortal,
  ModalClose,
} from "../";

import { motion, AnimatePresence } from "framer-motion";

export default { title: "Components/Modal", tags: ["autodocs"] };

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
  return (
    <Modal>
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

function NestParent({ children }: { children?: ReactNode }) {
  return (
    <Modal>
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
                    {children}
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

export function Nest() {
  return (
    <NestParent>
      <div>layer1</div>
      <NestParent>
        <div>layer2</div>
        <NestParent>
          <div>layer3</div>
          <NestParent>
            <div>layer4</div>
          </NestParent>
        </NestParent>
      </NestParent>
    </NestParent>
  );
}

export function Scroll() {
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
            <ModalContent className="bg-white rounded w-2/5 p-6 overflow-y-auto max-h-[400px] ">
              <div className="w-full bg-slate-400 h-[1000px]"></div>
              <div className="mb-2">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry.
              </div>
              <div className="w-full bg-slate-400 h-[1000px]"></div>
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
