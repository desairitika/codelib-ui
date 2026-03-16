import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { validateAction } from "../redux/actions/authActions";
import Loader from "../components/common/loaders/Loader";
import { getToken } from "../utils/TokenUtil";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const validationAttemptedRef = useRef(false);

  const checkAuthentication = useCallback(async () => {
    if (validationAttemptedRef.current) {
      // Already attempted validation, don't try again
      return;
    }

    validationAttemptedRef.current = true;

    try {
      await dispatch(validateAction());
      setLoading(false);
    } catch (error) {
      console.error("Authentication error:", error);
      setIsError(true);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // If no token, don't attempt validation
    if (!token) {
      setLoading(false);
      validationAttemptedRef.current = false;
      return;
    }

    // Already authenticated, no need to validate
    if (isAuthenticated) {
      setLoading(false);
      return;
    }

    // Already attempted validation and it failed, stop here
    if (isError) {
      setLoading(false);
      return;
    }

    // If we've already attempted validation, don't try again
    if (validationAttemptedRef.current) {
      setLoading(false);
      return;
    }

    // Attempt validation with small delay
    const timeoutId = setTimeout(() => {
      checkAuthentication();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, token, isError, checkAuthentication]);

  if (loading) {
    return <Loader></Loader>;
  }

  // Redirect to login if not authenticated
  if (isError || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
