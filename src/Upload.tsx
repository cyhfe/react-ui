import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

// useage

// label not in div

function Thumbnail() {
  return;
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

interface UploadProps extends ComponentPropsWithoutRef<"input"> {
  fileList: File[];
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
}

const Input = forwardRef<HTMLInputElement, UploadProps>(function Upload(
  props,
  forwardRef
) {
  const { fileList, setFileList, ...rest } = props;
  const inutRef = useRef<HTMLInputElement | null>(null);
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
        onChange={(e) => {
          const uploadInput = e.currentTarget;
          if (!uploadInput.files) return;
          console.log(uploadInput.files);
          for (const file of uploadInput.files) {
            setFileList((prev) => [...prev, file]);
          }
          let numberOfBytes = 0;
          for (const file of uploadInput.files) {
            numberOfBytes += file.size;
          }

          // Approximate to the closest prefixed unit
          const units = [
            "B",
            "KiB",
            "MiB",
            "GiB",
            "TiB",
            "PiB",
            "EiB",
            "ZiB",
            "YiB",
          ];
          const exponent = Math.min(
            Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
            units.length - 1
          );
          const approx = numberOfBytes / 1024 ** exponent;
          const output =
            exponent === 0
              ? `${numberOfBytes} bytes`
              : `${approx.toFixed(3)} ${
                  units[exponent]
                } (${numberOfBytes} bytes)`;
          console.log(output);
        }}
      />

      <div
        className="w-24 h-24 bg-gray-300"
        onClick={() => inutRef.current?.click()}
      >
        Upload
      </div>
    </div>
  );
});

const baseUrl = "http://localhost:3000";
function Demo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<File[]>([]);

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
            formData.append("avatar", file);
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
        <input type="text" name="customName" />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export { Demo };
