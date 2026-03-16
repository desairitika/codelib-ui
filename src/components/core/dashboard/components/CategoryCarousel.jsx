import PropTypes from "prop-types";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { categoryColorMap } from "../../../../utils/constants.jsx";
import styles from "./CategoryCarousel.module.scss";

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} ${styles.arrow} ${styles.prevArrow}`}
    style={{ ...style }}
    onClick={onClick}
    aria-label="Previous"
  >
    <FaChevronLeft />
  </div>
);

const NextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} ${styles.arrow} ${styles.nextArrow}`}
    style={{ ...style }}
    onClick={onClick}
    aria-label="Next"
  >
    <FaChevronRight />
  </div>
);

const CategoryCarousel = ({
  categories,
  stats = { categoryCounts: {} },
  iconMap,
  onCategoryClick,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    centerMode: true,
    centerPadding: "40px",
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1378,
        settings: { slidesToShow: 5, slidesToScroll: 2, centerPadding: "36px" },
      },
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 2, centerPadding: "32px" },
      },
      {
        breakpoint: 1080,
        settings: { slidesToShow: 3, slidesToScroll: 1, centerPadding: "24px" },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1, centerPadding: "20px" },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "12px" },
      },
    ],
  };

  const getBgColor = (value, index) => {
    const key = String(value).toLowerCase();
    if (categoryColorMap[key]) return categoryColorMap[key];

    const palette = Object.values(categoryColorMap).filter(
      (c) => c !== categoryColorMap.default
    );

    return palette[index % palette.length] || categoryColorMap.default;
  };

  return (
    <div className={styles.categorySection}>
      <h2 className={styles.sectionTitle}>Data Structures Algorithm</h2>

      <div className={styles.backgroundBlend}>
        <Slider {...settings} className={styles.carousel}>
          {categories.map((item, index) => (
            <div
              className={styles.dashboardBoxCarousel}
              key={index}
              style={{ background: getBgColor(item.value, index) }}
              onClick={() => onCategoryClick({ category: item.value })}
              role="button"
              tabIndex={0}
              title={`${item.label}: ${
                stats.categoryCounts[item.value] ?? 0
              } problems`}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onCategoryClick({ category: item.value });
                }
              }}
              aria-label={`${item.label}: ${
                stats.categoryCounts[item.value] ?? 0
              }`}
            >
              <div className={styles.icon}>{iconMap[item.icon]}</div>

              <div className={styles.info}>
                <h3>{item.label}</h3>
                <p>{stats.categoryCounts[item.value] ?? 0}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className={styles.viewAllWrapper}>
        <button
          className={styles.viewAllButton}
          onClick={() => onCategoryClick({})}
        >
          View All Categories
        </button>
      </div>
    </div>
  );
};

CategoryCarousel.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  stats: PropTypes.shape({
    categoryCounts: PropTypes.object,
  }),
  iconMap: PropTypes.object.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
};

export default CategoryCarousel;
