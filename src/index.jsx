import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import store from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { initializeSentry } from "./utils/sentry";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Initialize Sentry error tracking early
initializeSentry();

const SentryApp = Sentry.withProfiler(App);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <NotificationProvider>
          <SentryApp />
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
