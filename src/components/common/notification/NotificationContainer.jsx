import React from "react";
import PropTypes from "prop-types";
import { useNotification } from "../../../context/NotificationContext";
import styles from "./NotificationContainer.module.scss";
import { IoCloseSharp } from "react-icons/io5";

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[`notification-${notification.type}`]}`}
          role="alert"
          aria-live="polite"
        >
          <div className={styles.content}>
            <span className={styles.message}>{notification.message}</span>
            <button
              className={styles.closeBtn}
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

NotificationContainer.propTypes = {};

export default NotificationContainer;
