import React, { useEffect, useRef, useState } from "react";
import { UploadAction, UploadInput, UploadRoot, useUpload } from "../lib";

export function ImageCrop() {
  const [file, setFile] = useState<string>();
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          console.log(e.target.files);
          if (e.target.files?.[0])
            setFile(URL.createObjectURL(e.target.files?.[0]));
        }}
      />
      <img src={file} alt="" width={300} />

      <Crop src={file} />
    </div>
  );
}

interface CropPros {
  src?: string;
}

function Crop({ src }: CropPros) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const imageObj = new Image();

    imageObj.onload = function () {
      if (!context) return;
      // draw cropped image
      const sourceX = 150;
      const sourceY = 0;
      const sourceWidth = 150;
      const sourceHeight = 150;
      const destWidth = sourceWidth;
      const destHeight = sourceHeight;
      const destX = canvas.width / 2 - destWidth / 2;
      const destY = canvas.height / 2 - destHeight / 2;

      context.drawImage(
        imageObj,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
      );
    };
    if (src) {
      imageObj.src = src;
    }
  });
  return <canvas ref={canvasRef}></canvas>;
}
