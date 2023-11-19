interface VisiuallyHiddenProps {
  children?: React.ReactNode;
}

function VisuallyHidden({ children }: VisiuallyHiddenProps) {
  return (
    <div
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: "1px",
        overflow: "hidden",
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px",
      }}
    >
      {children}
    </div>
  );
}

export { VisuallyHidden };
