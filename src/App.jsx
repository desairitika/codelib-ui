// import styles from "./App.module.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import AppToastContainer from "./components/common/toast/ToastContainer";
import NotificationContainer from "./components/common/notification/NotificationContainer";
import { ConstantsProvider } from "./context/ConstantsContext";
import ErrorBoundary from "./components/common/error-boundary/ErrorBoundary";
import { setApiErrorHandler } from "./services/apiService";
import { AddToastAction } from "./redux/actions/toastAction";
import { validateAction, initialAuthCheckComplete } from "./redux/actions/authActions";
import { getToken } from "./utils/TokenUtil";
import Loader from "./components/common/loaders/Loader";

function App() {
  const dispatch = useDispatch();
  const initialAuthCheckComplete_flag = useSelector((state) => state.auth.initialAuthCheckComplete);

  useEffect(() => {
    // Restore authentication state on app initialization if token exists
    if (getToken()) {
      dispatch(validateAction());
    } else {
      // No token, mark initial check as complete
      dispatch(initialAuthCheckComplete());
    }
  }, [dispatch]);

  useEffect(() => {
    // Register global error handler for API calls
    setApiErrorHandler((errorMessage) => {
      const payload = {
        bg: "danger",
        header: "Error",
        body: errorMessage,
        time: 5000,
        show: true,
      };
      dispatch(AddToastAction(payload));
    });
  }, [dispatch]);

  // Show loader until initial auth check is complete
  if (!initialAuthCheckComplete_flag) {
    return (
      <ErrorBoundary>
        <ConstantsProvider>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Loader />
          </div>
        </ConstantsProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ConstantsProvider>
        <Router>
          <AppToastContainer></AppToastContainer>
          <NotificationContainer />
          <AppRoutes />
        </Router>
      </ConstantsProvider>
    </ErrorBoundary>
  );
}

export default App;
