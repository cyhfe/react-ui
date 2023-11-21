import {
  Modal,
  // useModal,
  ModalTrigger,
  ModalContent,
  ModalPortal,
  ModalClose,
} from "../";

export default { title: "Components/Modal" };

export function Default() {
  return (
    <Modal clickOverlayToClose>
      <ModalTrigger>trigger</ModalTrigger>
      <ModalPortal className="fixed top-0 bottom-0 left-0 right-0 bg-black/20 flex items-center justify-center">
        <ModalContent className="bg-white w-1/2 p-4">
          <div>content</div>
          <ModalClose>
            <span>close</span>
          </ModalClose>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
