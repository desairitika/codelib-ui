import PropTypes from "prop-types";
import styles from "./ProblemSkeleton.module.scss";

const ProblemSkeleton = ({ count = 5 }) => {
  return (
    <div className={styles.skeletonContainer}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={styles.problemSkeleton}>
          <div className={styles.title}></div>
          <div className={styles.row}>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
          </div>
          <div className={styles.description}></div>
          <div className={styles.footer}>
            <div className={styles.button}></div>
            <div className={styles.button}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProblemSkeleton.propTypes = {
  count: PropTypes.number,
};

export default ProblemSkeleton;
