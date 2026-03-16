import PropTypes from "prop-types";
import styles from "./StatsCard.module.scss";
import useCountUp from "../../../../hooks/useCountUp";

const StatsCard = ({ title, count, icon, color, onClick, percent }) => {
  const animated = useCountUp(count, 900);

  return (
    <div
      className={styles.dashboardBox}
      style={{ background: color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      aria-label={`${title}: ${count}`}
    >
      <div className={styles.topSection}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.countSection}>
        <p className={styles.count}>{animated}</p>
      </div>
      {typeof percent === "number" && (
        <div className={styles.progressBar} aria-hidden>
          <div className={styles.progress} style={{ width: `${Math.min(Math.max(percent,0),100)}%` }} />
        </div>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StatsCard;
