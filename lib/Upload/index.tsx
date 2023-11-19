import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";

import { v4 as uuid } from "uuid";
import { createContext } from "../createContext";
import { Slot } from "../Slot";
import { VisuallyHidden } from "../VisuallyHidden";
import { useComposeRefs } from "../useComposeRefs";

// const baseUrl = "http://localhost:3000";

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

// useage

// label not in div

interface UploadContextValue {
  getFileList: () => FileWithId[];
  removeFile: (uid: string) => void;
  addFiles: (files: FileList) => void;
  name: string;
  url: string;
  method: HTTPMethods;
}

const [UploadProvider, useUpload] = createContext<UploadContextValue>("Upload");

type HTTPMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD"
  | "CONNECT"
  | "TRACE";
interface UploadProps {
  children: ReactNode;
  name: string;
  url?: string;
  method?: HTTPMethods;
}

function Upload(props: UploadProps) {
  const [fileList, setFileList] = useState<FileWithId[]>([]);
  const { children, name, url = "/", method = "POST" } = props;

  const getFileList = useCallback(() => {
    return fileList;
  }, [fileList]);

  const removeFile = useCallback((uid: string) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  }, []);

  const addFiles = useCallback((files: FileList) => {
    const formatedFiles = Array.from(files).map((file) => ({
      file,
      uid: uuid(),
    }));
    setFileList((prev) => {
      return [...prev, ...formatedFiles];
    });
  }, []);

  return (
    <UploadProvider
      getFileList={getFileList}
      removeFile={removeFile}
      addFiles={addFiles}
      name={name}
      url={url}
      method={method}
    >
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
  const { addFiles } = useUpload("Input");
  const { children, enableDrop = false, ...rest } = props;
  const inutRef = useRef<HTMLInputElement | null>(null);
  const composedRef = useComposeRefs(forwardRef, inutRef);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadInput = e.currentTarget;
    if (!uploadInput.files) return;
    addFiles(uploadInput.files);
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
          addFiles(dt.files);
        }}
      >
        {children ?? <button>upload</button>}
      </Slot>
    </div>
  );
});

function formatSize(size: number) {
  const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  const exponent = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  );
  const approx = size / 1024 ** exponent;
  const output =
    exponent === 0
      ? `${size} bytes`
      : `${approx.toFixed(3)} ${units[exponent]}`;

  return output;
}

function Details() {
  const { getFileList, removeFile } = useUpload("Input");
  const fileList = getFileList();
  console.log(fileList);
  return (
    <div>
      {fileList.map((file) => (
        <div key={file.uid}>
          {file.file.type.match(
            /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/
          ) && (
            <img
              src={URL.createObjectURL(file.file)}
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
          )}
          <span>{file.file.name}</span>
          <span>({formatSize(file.file.size)})</span>
          <button onClick={() => removeFile(file.uid)}>remove</button>
        </div>
      ))}
    </div>
  );
}

interface ActionProps {
  children: (props: {
    progress: number;
    status: Status;
    upload: () => void;
    abort: () => void;
  }) => ReactNode;
}

type Status = "idle" | "pending" | "success" | "error";

function Action(props: ActionProps) {
  const { children } = props;
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest>();
  const [status, setStatus] = useState<Status>("idle");

  const { getFileList, url, method, name } = useUpload("Input");
  const fileList = getFileList();
  const abort = useCallback(() => {
    const xhr = xhrRef.current;
    if (xhr && status === "pending") {
      xhr.abort();
    }
  }, [status]);
  const upload = useCallback(() => {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.upload.addEventListener(
      "progress",
      (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          setProgress(percentage);
        }
      },
      false
    );
    xhr.addEventListener("load", () => {
      setStatus("success");
    });
    xhr.addEventListener("loadend", () => {
      // setStatus("idle");
    });
    xhr.addEventListener("error", () => {
      setStatus("error");
    });
    xhr.addEventListener("loadstart", () => {
      setStatus("pending");
    });
    if (xhr) {
      xhr.overrideMimeType("text/plain; charset=x-user-defined-binary");
      xhr.open(method, url);
      const formData = new FormData();
      const files = fileList.map((file) => file.file);
      for (const file of files) {
        formData.append(name, file);
      }
      xhr.send(formData);
    }
  }, [fileList, method, name, url]);
  return children({
    upload,
    abort,
    progress,
    status,
  });
}

interface FileWithId {
  file: File;
  uid: string;
}

// function Demo() {
//   return (
//     <div>
//       <Upload name="avatar" url={baseUrl + "/upload"}>
//         <Input enableDrop multiple>
//           <div>custom upload</div>
//         </Input>
//         <Details />
//         <Action>
//           {({ upload, abort, progress, status }) => (
//             <div>
//               <button onClick={upload}>upload</button>
//               <button onClick={abort}>abort</button>
//               {status === "pending" && <span>{progress}%</span>}
//               <span>{status}</span>
//             </div>
//           )}
//         </Action>
//       </Upload>
//     </div>
//   );
// }

const Root = Upload;

// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export { Root, Upload, Details, Action, Input };
