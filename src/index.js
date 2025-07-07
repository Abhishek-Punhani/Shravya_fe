import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./contexts/ThemeContext";
window.process = {
  env: {
    NODE_ENV: "development",
  },
  nextTick: function (cb) {
    return setTimeout(cb, 0);
  },
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
