import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Demo } from "./Upload.tsx";
import { ModalDemo } from "./Modal.tsx";
import { TooltipDemo } from "./Tooltip.tsx";
import { TabsDemo } from "./Tabs.tsx";
import { PopupDemo } from "./Popup.tsx";
import { SelectDemo } from "./Select.tsx";
import { Toaster } from "./Toast.tsx";

import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/* <Demo /> */}
    {/* <ModalDemo /> */}
    {/* <TooltipDemo /> */}
    {/* <TabsDemo /> */}
    {/* <PopupDemo /> */}
    {/* <SelectDemo /> */}
    <Toaster />
  </React.StrictMode>
);
