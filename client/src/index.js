import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ElectionProvider } from "./context/ElectionContext";

ReactDOM.render(
  <ElectionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ElectionProvider>,
  document.getElementById("root")
);
