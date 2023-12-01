import React from "react";

import { addToast } from "./Toast";
export default function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={() => addToast({ content: "sad1" })}>toast</button>
      <button onClick={() => addToast({ content: "sad2" })}>toast</button>
      <button onClick={() => addToast({ content: "sad3" })}>toast</button>
      <button onClick={() => addToast({ content: "sad4" })}>toast</button>
      <button onClick={() => addToast({ content: "sad5" })}>toast</button>
      <button onClick={() => addToast({ content: "sad6" })}>toast</button>
    </div>
  );
}
