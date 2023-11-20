import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Demo } from "./Upload.tsx";
import { ModalDemo } from "./Modal.tsx";

import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Demo /> */}
    <ModalDemo />
  </React.StrictMode>
);
