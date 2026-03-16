import React from "react";
import styles from "./Loader.module.scss";

const PicLoader = ({ width = "100%", height = "100%", borderRadius = "0px", style = {} }) => {
  return (
    <div
      className={styles["shimmer-wrapper"]}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    >
      <div className={styles["shimmer"]} style={{ borderRadius }}></div>
    </div>
  );
};

export default PicLoader;
