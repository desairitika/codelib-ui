import React, { useEffect } from "react";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useDispatch, useSelector } from "react-redux";
import DismissibleToast from "./Toast";
import { AddToastAction } from "../../../redux/actions/toastAction";

function AppToastContainer() {
  const { toastList } = useSelector((state) => state.toasts);
  const dispatch = useDispatch();
  let toastsElement = [];

  if (toastList && toastList.length) {
    toastsElement = toastList.map((toast, index) => (
      <DismissibleToast
        key={index}
        bg={toast.bg}
        header={toast.header}
        body={toast.body}
        imgScr={toast.imgSrc}
        show={toast.show}
        time={toast.time}
        index={index}
      ></DismissibleToast>
    ));
  }

  useEffect(() => {
    // when the toast list changes we schedule a removal of the first item
    // after its configured time (or a default of 2 s). the previous timer is
    // cleared automatically when the effect re‑runs.
    if (toastList && toastList.length > 0) {
      const firstToast = toastList[0];
      const timeout = typeof firstToast.time === "number" ? firstToast.time : 2000;
      const timer = setTimeout(() => {
        const updatedItems = toastList.slice(1);
        dispatch(AddToastAction(updatedItems));
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [toastList, dispatch]);

  return (
    <ToastContainer className="p-3 w-25 text-center" position="bottom-end" style={{ zIndex: 1099 }}>
      {toastsElement.reverse()}
    </ToastContainer>
  );
}

export default AppToastContainer;
