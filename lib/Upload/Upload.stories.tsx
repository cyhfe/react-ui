import { Upload, UploadAction, UploadInput, useUpload } from "../";

export default { title: "Components/Upload" };
import { MdDeleteOutline } from "react-icons/md";
import { LuHardDriveUpload } from "react-icons/lu";

const baseUrl = "http://localhost:3000";

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

function FileList() {
  const { getFileList, removeFile } = useUpload("FileList");
  const fileList = getFileList();
  if (!fileList.length) return <div>No files</div>;
  return (
    <div className="mb-2">
      {fileList.map((file) => (
        <div
          className="flex items-center justify-between px-4 py-2 bg-slate-100 rounded-md mb-2"
          key={file.uid}
        >
          <div>
            <span>{file.file.name}</span>
            <span> ({formatSize(file.file.size)})</span>
          </div>

          <div className="cursor-pointer" onClick={() => removeFile(file.uid)}>
            <MdDeleteOutline className="text-red-500" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Default() {
  return (
    <Upload name="avatar" url={baseUrl + "/upload"}>
      <div className="max-w-md">
        <div className="mb-5">
          <div className="mb-2 block text-xl font-semibold">Upload files</div>
          <UploadInput multiple>
            <div className="border border-dashed min-h-[200px] flex items-center justify-center mb-5">
              <div className="text-center">
                <div className=" mb-2">Drop Files Here</div>
                <div className="mb-2">or</div>
                <button type="button" className="border px-4 py-2">
                  Browse
                </button>
              </div>
            </div>
          </UploadInput>
        </div>

        <div className="mb-5">
          <div className="mb-2 block text-xl font-semibold">FileList</div>
          <FileList />
        </div>

        <div className="mb-5">
          <div className="mb-2 block text-xl font-semibold">Actions</div>
          <UploadAction>
            {({ upload, abort, progress, status }) => (
              <div>
                <div className="flex gap-x-2 mb-2">
                  <button
                    onClick={upload}
                    className="border px-2 py-1 rounded bg-slate-950 text-white"
                  >
                    upload
                  </button>
                  <button
                    onClick={abort}
                    className="border px-2 py-1 rounded bg-red-500 text-white"
                  >
                    abort
                  </button>
                </div>
                <div>progress: {<span>{progress}%</span>}</div>
                <div>status: {<span>{status}</span>}</div>
              </div>
            )}
          </UploadAction>
        </div>
      </div>
    </Upload>
  );
}

function ImageList() {
  const { getFileList, removeFile } = useUpload("FileList");
  const fileList = getFileList();
  return (
    <div className="flex gap-2 flex-wrap">
      {fileList.map((file) => (
        <div
          className="border  rounded w-28 h-28 flex items-center justify-center"
          key={file.uid}
        >
          <img
            className="object-scale-down w-28 h-28"
            src={URL.createObjectURL(file.file)}
            alt={file.file.name}
            onClick={() => removeFile(file.uid)}
          />
        </div>
      ))}
      <UploadInput multiple accept="image/*">
        <div className="border  rounded border-dashed w-28 h-28 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <LuHardDriveUpload className="mb-2" />
            <div>upload</div>
          </div>
        </div>
      </UploadInput>
    </div>
  );
}

export function UploadImages() {
  return (
    <Upload name="avatar" url={baseUrl + "/upload"}>
      <div className="max-w-md">
        <div className="mb-5">
          <div className="mb-2 block text-xl font-semibold">Upload Images</div>
          <ImageList />
        </div>

        <div className="mb-5">
          <div className="mb-2 block text-xl font-semibold">Actions</div>
          <UploadAction>
            {({ upload, abort, progress, status }) => (
              <div>
                <div className="flex gap-x-2 mb-2">
                  <button
                    onClick={upload}
                    className="border px-2 py-1 rounded bg-slate-950 text-white"
                  >
                    upload
                  </button>
                  <button
                    onClick={abort}
                    className="border px-2 py-1 rounded bg-red-500 text-white"
                  >
                    abort
                  </button>
                </div>
                <div>progress: {<span>{progress}%</span>}</div>
                <div>status: {<span>{status}</span>}</div>
              </div>
            )}
          </UploadAction>
        </div>
      </div>
    </Upload>
  );
}
