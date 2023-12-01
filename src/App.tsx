import React from "react";

import { addToast } from "./Toast";
export default function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={() => addToast({ content: "sad" })}>toast</button>
    </div>
  );
}
