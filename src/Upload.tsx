import React, {
  ChangeEvent,
  ComponentPropsWithoutRef,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid } from "uuid";
import { createContext } from "../lib/createContext";
import { Slot } from "../lib/Slot";
import { VisuallyHidden } from "../lib/VisuallyHidden";
import { useComposeRefs } from "../lib/useComposeRefs";

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

// useage

// label not in div

interface UploadContextValue {
  fileList: FileWithId[];
  setFileList: Dispatch<SetStateAction<FileWithId[]>>;
}

const [UploadProvider, useUpload] = createContext<UploadContextValue>("Upload");

interface UploadProps {
  children: ReactNode;
}

function Upload(props: UploadProps) {
  const [fileList, setFileList] = useState<FileWithId[]>([]);
  const { children } = props;
  return (
    <UploadProvider fileList={fileList} setFileList={setFileList}>
      {children}
    </UploadProvider>
  );
}

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  enableDrop?: boolean;
  children?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Upload(
  props,
  forwardRef
) {
  const { setFileList } = useUpload("Input");
  const { children, enableDrop = false, ...rest } = props;
  const inutRef = useRef<HTMLInputElement | null>(null);
  const composedRef = useComposeRefs(forwardRef, inutRef);
  // const handleChange = (e: any) => {
  //   const uploadInput = e.currentTarget;
  //   if (!uploadInput.files) return;
  //   // const files = Array.from(uploadInput.files);
  //   // console.log(files);

  //   // for ( (file, i) of uploadInput.files) {
  //   //   const fileWithId = {
  //   //     ...file,
  //   //     uid: uuid(),
  //   //   };
  //   //   setFileList((prev) => [...prev, fileWithId]);
  //   // }

  //   for (let i = 0; i < uploadInput.files.length; i++) {
  //     const file = uploadInput.files[i];
  //     const fileWithId = {
  //       file,
  //       uid: uuid(),
  //     };
  //     setFileList((prev) => [...prev, fileWithId]);
  //   }
  //   let numberOfBytes = 0;
  //   for (const file of uploadInput.files) {
  //     numberOfBytes += file.size;
  //   }

  //   // Approximate to the closest prefixed unit
  //   const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  //   const exponent = Math.min(
  //     Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
  //     units.length - 1
  //   );
  //   const approx = numberOfBytes / 1024 ** exponent;
  //   const output =
  //     exponent === 0
  //       ? `${numberOfBytes} bytes`
  //       : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`;
  //   console.log(output);
  // };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadInput = e.currentTarget;
    if (!uploadInput.files) return;
    for (let i = 0; i < uploadInput.files.length; i++) {
      const file = uploadInput.files[i];
      const fileWithId = {
        file,
        uid: uuid(),
      };
      setFileList((prev) => [...prev, fileWithId]);
    }
  };
  return (
    <div>
      <VisuallyHidden>
        <input
          type="file"
          ref={composedRef}
          onChange={handleChange}
          {...rest}
        />
      </VisuallyHidden>
      <Slot
        onClick={() => {
          const input = inutRef.current;
          if (input) {
            input.value = "";
            input.click();
          }
        }}
        onDragEnter={(e) => {
          if (!enableDrop) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragOver={(e) => {
          if (!enableDrop) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          if (!enableDrop) return;
          e.preventDefault();
          e.stopPropagation();
          const dt = e.dataTransfer;
          for (let i = 0; i < dt.files.length; i++) {
            const file = dt.files[i];
            const fileWithId = {
              file,
              uid: uuid(),
            };
            setFileList((prev) => [...prev, fileWithId]);
          }
        }}
      >
        {children ?? <button>upload</button>}
      </Slot>
    </div>
  );
});

interface ThumbnailsProps {
  fileList: FileWithId[];
}
function Thumbnails({ fileList }: ThumbnailsProps) {
  return (
    <div>
      {fileList.map((file) => (
        <div key={file.uid}>
          <img src={URL.createObjectURL(file.file)} />
        </div>
      ))}
    </div>
  );
}

interface FileWithId {
  file: File;
  uid: string;
}
// interface UploadProps extends ComponentPropsWithoutRef<"input"> {
//   fileList: FileWithId[];
//   setFileList: React.Dispatch<React.SetStateAction<FileWithId[]>>;
// }

const baseUrl = "http://localhost:3000";

function Demo() {
  return (
    <div>
      <Upload>
        <Input enableDrop>
          <div>custom upload</div>
        </Input>
        {/* <Details />
        <Thumbnail /> */}
      </Upload>
    </div>
  );
}

// function Demo() {
//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const [fileList, setFileList] = useState<FileWithId[]>([]);
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState<
//     "pending" | "success" | "error" | "idle"
//   >("idle");
//   const xhrRef = useRef<XMLHttpRequest>();

//   useEffect(() => {
//     console.log(fileList);
//   }, [fileList]);
//   return (
//     <div>
//       <Input fileList={fileList} setFileList={setFileList} />
//       <div>
//         <div>
//           {fileList.map((file) => (
//             <div key={file.uid}>
//               <span>{file.file.name}</span>
//               <span>{file.file.size}</span>
//               <span
//                 onClick={() =>
//                   setFileList((prev) => prev.filter((x) => x.uid !== file.uid))
//                 }
//               >
//                 x
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Thumbnails fileList={fileList} />

//       {/* action */}
//       <div>
//         <button
//           onClick={() => {
//             const xhr = new XMLHttpRequest();
//             xhrRef.current = xhr;
//             xhr.upload.addEventListener(
//               "progress",
//               (e) => {
//                 if (e.lengthComputable) {
//                   const percentage = Math.round((e.loaded * 100) / e.total);
//                   setProgress(percentage);
//                   // console.log(percentage, "progress");
//                 }
//               },
//               false
//             );
//             xhr.addEventListener("load", () => {
//               setStatus("success");
//             });
//             xhr.addEventListener("loadend", () => {
//               setStatus("idle");
//             });
//             xhr.addEventListener("error", () => {
//               setStatus("error");
//             });
//             xhr.addEventListener("loadstart", () => {
//               setStatus("pending");
//             });
//             if (xhr) {
//               xhr.overrideMimeType("text/plain; charset=x-user-defined-binary");
//               xhr.open("POST", baseUrl + "/profile");
//               const formData = new FormData();
//               const files = fileList.map((file) => file.file);
//               for (const file of files) {
//                 formData.append("avatar", file);
//               }
//               xhr.send(formData);
//             }
//           }}
//         >
//           upload
//         </button>
//         <button
//           onClick={() => {
//             const xhr = xhrRef.current;
//             if (xhr) {
//               xhr.abort();
//             }
//           }}
//         >
//           abort
//         </button>
//       </div>

//       <div>{progress}</div>
//     </div>
//   );
// }

// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export { Demo };
