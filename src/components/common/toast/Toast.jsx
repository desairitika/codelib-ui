import React, { useState, useEffect, useRef } from "react";
import Toast from "react-bootstrap/Toast";
import { IoNotifications } from "react-icons/io5";
import { playErrorSound } from "../../../assets/sounds/error-sound";

function DismissibleToast(props) {
  const [show, setShow] = useState(props.show);
  const soundPlayedRef = useRef(false);
  const toastIdRef = useRef(Math.random()); // Unique ID for this toast instance

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  useEffect(() => {
    // Play error sound when toast appears and is an error type
    // Check both by background color and by header text "Error"
    const isError = props.bg === "danger" || props.header === "Error";
    if (show && isError) {
      console.log('Toast detected as error, playing sound for:', props.header);
      playErrorSound();
    }
  }, [show, props.bg, props.header, props.body]);

  // if a numeric `time` prop is passed, use it as the autohide delay
  // otherwise fall back to the old index-based delay so existing behaviour
  // for toasts without a custom duration is preserved.
  const delayMs = typeof props.time === "number" ? props.time : (props.index + 1) * 2000;

  return (
    <Toast
      className="d-inline-block m-1"
      bg={props.bg ? props.bg : "secondary"}
      onClose={() => setShow(false)}
      show={show}
      delay={delayMs}
      autohide
    >
      <Toast.Header>
        {props.imgSrc ? <img src={props.imgSrc} className="rounded me-2" alt="" /> : <IoNotifications className="rounded me-2" />}
        <strong className="me-auto">{props.header ? props.header : "Notification"}</strong>
        {props.time && <small>{props.time}</small>}
      </Toast.Header>
      <Toast.Body>{props.body ? props.body : "No Message Provided"}</Toast.Body>
    </Toast>
  );
}

export default DismissibleToast;
