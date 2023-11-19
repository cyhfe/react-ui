import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid } from "uuid";

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

// useage

// label not in div

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

// function Demo(){
//   return <div>
//     <Upload>
//       <Input />
//       <Details />
//       <Thumbnail />
//     </Upload>
//   </div>
// }

interface FileWithId {
  file: File;
  uid: string;
}
interface UploadProps extends ComponentPropsWithoutRef<"input"> {
  fileList: FileWithId[];
  setFileList: React.Dispatch<React.SetStateAction<FileWithId[]>>;
}

const Input = forwardRef<HTMLInputElement, UploadProps>(function Upload(
  props,
  forwardRef
) {
  const { fileList, setFileList, ...rest } = props;
  const inutRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: any) => {
    const uploadInput = e.currentTarget;
    if (!uploadInput.files) return;
    // const files = Array.from(uploadInput.files);
    // console.log(files);

    // for ( (file, i) of uploadInput.files) {
    //   const fileWithId = {
    //     ...file,
    //     uid: uuid(),
    //   };
    //   setFileList((prev) => [...prev, fileWithId]);
    // }

    for (let i = 0; i < uploadInput.files.length; i++) {
      const file = uploadInput.files[i];
      const fileWithId = {
        file,
        uid: uuid(),
      };
      setFileList((prev) => [...prev, fileWithId]);
    }
    let numberOfBytes = 0;
    for (const file of uploadInput.files) {
      numberOfBytes += file.size;
    }

    // Approximate to the closest prefixed unit
    const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const exponent = Math.min(
      Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
      units.length - 1
    );
    const approx = numberOfBytes / 1024 ** exponent;
    const output =
      exponent === 0
        ? `${numberOfBytes} bytes`
        : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`;
    console.log(output);
  };

  useEffect(() => {
    const input = inutRef.current;
    if (input) {
      input.addEventListener("change", handleChange);
      return () => {
        input.removeEventListener("change", handleChange);
      };
    }
  });
  return (
    <div>
      <input
        id="id"
        className="hidden"
        type="file"
        name="avatar"
        ref={(node) => {
          inutRef.current = node;
          if (typeof forwardRef === "function") {
            forwardRef(node);
          } else if (forwardRef) {
            forwardRef.current = node;
          }
        }}
        multiple
        // onChange={(e) => {
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
        //   const units = [
        //     "B",
        //     "KiB",
        //     "MiB",
        //     "GiB",
        //     "TiB",
        //     "PiB",
        //     "EiB",
        //     "ZiB",
        //     "YiB",
        //   ];
        //   const exponent = Math.min(
        //     Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
        //     units.length - 1
        //   );
        //   const approx = numberOfBytes / 1024 ** exponent;
        //   const output =
        //     exponent === 0
        //       ? `${numberOfBytes} bytes`
        //       : `${approx.toFixed(3)} ${
        //           units[exponent]
        //         } (${numberOfBytes} bytes)`;
        //   console.log(output);
        // }}
        {...rest}
      />

      <div
        className="w-24 h-24 bg-gray-300"
        onClick={() => {
          const input = inutRef.current;
          if (input) {
            input.value = "";
            input.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
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
        //         dropbox.addEventListener("dragenter", dragenter, false);
        // dropbox.addEventListener("dragover", dragover, false);
        // dropbox.addEventListener("drop", drop, false);
      >
        Upload
      </div>
    </div>
  );
});

const baseUrl = "http://localhost:3000";
function Demo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileWithId[]>([]);

  useEffect(() => {
    console.log(fileList);
  }, [fileList]);
  return (
    <div>
      <form
        // encType="multipart/form-data"
        // method="POST"
        // action={baseUrl + "/profile"}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData();
          // console.log(inputRef.current!.files![0]);
          for (const file of fileList) {
            formData.append("avatar", file.file);
          }

          // console.log(Object.fromEntries(formData));
          try {
            const res = await fetch(baseUrl + "/profile", {
              method: "POST",
              body: formData,
              headers: {
                // "Content-Type": "multipart/form-data",
              },
            });

            const data = await res.json();
            console.log(data, "data");
          } catch (error) {
            console.log(error, "error");
          }
        }}
      >
        <Input fileList={fileList} setFileList={setFileList} />
        <div>
          <div>
            {fileList.map((file) => (
              <div key={file.uid}>
                <span>{file.file.name}</span>
                <span>{file.file.size}</span>
                <span
                  onClick={() =>
                    setFileList((prev) =>
                      prev.filter((x) => x.uid !== file.uid)
                    )
                  }
                >
                  x
                </span>
              </div>
            ))}
          </div>
        </div>
        <Thumbnails fileList={fileList} />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export { Demo };
