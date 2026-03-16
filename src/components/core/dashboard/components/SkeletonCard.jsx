import PropTypes from "prop-types";
import styles from "./SkeletonCard.module.scss";

const SkeletonCard = () => {
  return <div className={styles.skeletonBox}></div>;
};

SkeletonCard.propTypes = {};

export default SkeletonCard;
