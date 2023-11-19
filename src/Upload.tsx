import React from "react";

// fetch('/upload', {
//   method: "POST",
//   body: formData,
//   // No content-type! With FormData obect, Fetch API sets this automatically.
//   // Doing so manually can lead to an error
// })

const baseUrl = "http://localhost:3000";
function Demo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <form
        // encType="multipart/form-data"
        // method="POST"
        // action={baseUrl + "/profile"}

        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          // console.log(inputRef.current!.files![0]);
          // formData.append("avatar", inputRef.current!.files![0]);
          // console.log(Object.fromEntries(formData).avatar);
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
        <div>asdas</div>
        <input
          type="file"
          name="avatar"
          ref={inputRef}
          onChange={(e) => {
            // console.log(e.currentTarget.files);
          }}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export { Demo };
