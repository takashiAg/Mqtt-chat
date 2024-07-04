import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStateProvider } from "./states/auth.hook";
import Wrapper from "./wrapper.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <Wrapper />
    </GlobalStateProvider>
  </React.StrictMode>
);
