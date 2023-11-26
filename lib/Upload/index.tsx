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

// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

// 隐藏input元素，自定义上传的UI
// 触发上传可以用label或者input.click
// html规范label里不能包裹div，所以选择visuallyhidden + input.click

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

function Root(props: UploadProps) {
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

interface ActionProps {
  children: (props: {
    progress: number;
    status: Status;
    upload: () => void;
    abort: () => void;
  }) => ReactNode;
}

type Status = "idle" | "pending" | "success" | "error" | "cancelled";

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
    xhr.addEventListener("abort", () => {
      setStatus("cancelled");
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

const Upload = Root;
const UploadAction = Action;
const UploadInput = Input;

export { Upload, UploadAction, UploadInput, useUpload };
