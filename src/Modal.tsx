// https://www.radix-ui.com/primitives/docs/components/dialog
// https://getbootstrap.com/docs/5.3/components/modal/

// 移除body的 scroll， 使用 modal 的内容滚动
// 点击modal背景关闭

import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { createPortal } from "react-dom";

function Root({ children }) {
  return children;
}

interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
  key?: string | null | undefined;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, key, ...rest } = props;
  return createPortal(<div {...rest} ref={forwardRef} />, container, key);
});

function Trigger({ children }) {
  return children;
}

function Overlay() {
  return <div></div>;
}
function Content({ children }) {
  return children;
}
function Description({ children }) {
  return children;
}

function Close({ children }) {
  return children;
}

function Title({ children }) {
  return children;
}

function ModalDemo() {
  return (
    <Root>
      <Trigger>open</Trigger>
      <Portal>
        <Overlay />
        <Content>
          <Title>Booking info</Title>
          <Description>
            Please enter the info for your booking below.
          </Description>
          <Close>close</Close>
        </Content>
      </Portal>
    </Root>
  );
}

export { ModalDemo };
