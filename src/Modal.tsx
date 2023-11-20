// https://www.radix-ui.com/primitives/docs/components/dialog
// https://getbootstrap.com/docs/5.3/components/modal/

// 移除body的 scroll， 使用 modal 的内容滚动
// 点击modal背景关闭

import React, {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { createContext } from "../lib/createContext";
import { useControllableState } from "../lib/useControllableState";

interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const [ModalProvider, useModal] = createContext<ModalContextValue>("Root");

interface RootProps extends ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Root = forwardRef<HTMLDivElement, RootProps>(function Root(
  props,
  forwardRef
) {
  const {
    children,
    open: value,
    onOpenChange: onChange,
    defaultOpen: defaultValue,
    ...rest
  } = props;
  const [open = false, setOpen] = useControllableState({
    value,
    onChange,
    defaultValue,
  });
  return (
    <ModalProvider open={open} setOpen={setOpen}>
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    </ModalProvider>
  );
});

interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const PortalBase = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, ...rest } = props;
  return createPortal(<div {...rest} ref={forwardRef} />, container);
});

function Portal({ children, ...props }: ComponentPropsWithRef<"div">) {
  const { open, setOpen } = useModal("Portal");
  if (!open) return null;
  return (
    <PortalBase
      {...props}
      onClick={(e) => {
        setOpen(false);
        e.stopPropagation();
      }}
    >
      {children}
    </PortalBase>
  );
}

function Trigger({ children }) {
  const { setOpen } = useModal("Trigger");
  return <div onClick={() => setOpen(true)}>{children}</div>;
}

function Content({ children }) {
  return (
    <div
      className="bg-white max-w-md "
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
function Description({ children }) {
  return children;
}

function Close({ children }) {
  const { setOpen } = useModal("Close");
  return <div onClick={() => setOpen(false)}>{children}</div>;
}

function Title({ children }) {
  return children;
}

function ModalDemo() {
  return (
    <Root>
      <Trigger>open</Trigger>
      <Portal className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 flex items-center justify-center overflow-y-auto">
        <Content>
          <Root>
            <Trigger>open</Trigger>
            <Portal className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 flex items-center justify-center overflow-y-auto">
              <Content>
                <Root>
                  <Trigger>open</Trigger>
                  <Portal className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 flex items-center justify-center overflow-y-auto">
                    <Content>
                      <div className="h-[800px]"></div>
                      <Title>Booking info</Title>
                      <Description>
                        Please enter the info for your booking below.
                      </Description>
                      <Close>close3</Close>
                    </Content>
                  </Portal>
                </Root>
                <Close>close2</Close>
              </Content>
            </Portal>
          </Root>
          <Close>close1</Close>
        </Content>
      </Portal>
    </Root>
  );
}

// function Nest() {
//   return (
//     <Root>
//       <Trigger>open</Trigger>
//       <Portal className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 flex items-center justify-center overflow-y-auto">
//         <Content>
//           <div className="h-[800px]"></div>
//           <Title>Booking info</Title>
//           <Description>
//             Please enter the info for your booking below.
//           </Description>
//           <Close>close</Close>
//         </Content>
//       </Portal>
//     </Root>
//   );
// }

export { ModalDemo };
