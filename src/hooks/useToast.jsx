import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddToastAction } from "/src/redux/actions/toastAction.js";

export const useToast = () => {
  const dispatch = useDispatch();
  const toastList = useSelector((state) => state.toasts.toastList);

  // Create a stable setToast function that dispatches the action
  // Note: We don't include toastList in dependencies because we're capturing
  // it from the selector and the action creator will handle the current state
  const setToast = useCallback((body = "", header = "", background = "", time = "", img = "") => {
    const payload = {
      bg: background,
      header,
      body,
      time,
      imgSrc: img,
      show: true,
    };

    // Dispatch action - the reducer will append to current state
    dispatch(AddToastAction(payload));
  }, [dispatch]);

  return { setToast };
};
