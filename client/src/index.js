import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AlertProvider } from "./context/AlterContext";
import { ElectionProvider } from "./context/ElectionContext";

ReactDOM.render(
  <ElectionProvider>
    <AlertProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AlertProvider>
  </ElectionProvider>,
  document.getElementById("root")
);
