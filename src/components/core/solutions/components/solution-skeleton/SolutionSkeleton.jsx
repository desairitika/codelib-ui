import PropTypes from "prop-types";
import styles from "./SolutionSkeleton.module.scss";

const SolutionSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.headerSkeleton}>
        <div className={styles.title}></div>
        <div className={styles.tagRow}>
          <div className={styles.tag}></div>
          <div className={styles.tag}></div>
        </div>
      </div>

      <div className={styles.editorSkeleton}>
        <div className={styles.editorHeader}></div>
        <div className={styles.editorContent}></div>
      </div>

      <div className={styles.outputSkeleton}>
        <div className={styles.outputHeader}></div>
        <div className={styles.outputContent}></div>
      </div>
    </div>
  );
};

SolutionSkeleton.propTypes = {};

export default SolutionSkeleton;
