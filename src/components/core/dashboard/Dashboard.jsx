import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import { FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiDiamondHard } from "react-icons/gi";
import { Gi3dGlasses } from "react-icons/gi";
import { BiSleepy } from "react-icons/bi";
import { CATEGORIES, iconMap } from "../../../utils/constants.jsx";
import { getDashboardStats } from "@services/problemService";
import { getConstants } from "@services/constantService";
import { getToken } from "../../../utils/TokenUtil";
import StatsCard from "./components/StatsCard";
import CategoryCarousel from "./components/CategoryCarousel";
import SkeletonCard from "./components/SkeletonCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([...CATEGORIES]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // if there's no token, redirect to login and avoid calling APIs
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories in parallel
        const fetchCategories = async () => {
          try {
            const res = await getConstants();
            if (res?.data) {
              setCategories(res.data.filter((c) => c.type === "category"));
            } else {
              setCategories([...CATEGORIES]);
            }
          } catch (err) {
            setCategories([...CATEGORIES]);
          }
        };

        // Fetch stats
        const fetchStats = async () => {
          try {
            const res = await getDashboardStats();
            setStats(res.stats);
          } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
          }
        };

        // Run both requests in parallel
        await Promise.all([
          CATEGORIES.length > 0 ? Promise.resolve() : fetchCategories(),
          fetchStats(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleProblemCompRoute = (filter) => {
    navigate("/problems", {
      state: {
        ...filter,
      },
    });
  };

  const dashboardItems = [
    { title: "Total Problems", count: stats?.total ?? 0, icon: <FaClipboardList />, color: "#6C5CE7", filter: {} },
    { title: "Solved Problems", count: stats?.solved ?? 0, icon: <FaCheckCircle />, color: "#00B894", filter: { status: "solved" } },
    { title: "Unsolved Problems", count: stats?.unsolved ?? 0, icon: <FaTimesCircle />, color: "#FD79A8", filter: { status: "unsolved" } },
    { title: "Easy", count: stats?.easy ?? 0, icon: <BiSleepy />, color: "#1db40e", filter: { difficulty: "easy" } },
    { title: "Medium", count: stats?.medium ?? 0, icon: <Gi3dGlasses />, color: "#bdbd46", filter: { difficulty: "medium" } },
    { title: "Hard", count: stats?.hard ?? 0, icon: <GiDiamondHard />, color: "#f7846c", filter: { difficulty: "hard" } },
  ];

  const totalCount = stats?.total ?? 0;

  const itemsWithPercent = dashboardItems.map((it) => ({
    ...it,
    percent: totalCount > 0 ? Math.round(((it.count || 0) * 100) / totalCount) : 0,
  }));

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* Stats Section */}
        <div className="mb-4">
          {loading ? (
            <div className="dashboard-container">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="dashboard-container">
              {itemsWithPercent.map((item, index) => (
                <StatsCard
                  key={index}
                  title={item.title}
                  count={item.count}
                  percent={item.percent}
                  icon={item.icon}
                  color={item.color}
                  onClick={() => handleProblemCompRoute(item.filter)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        {!loading && categories.length > 0 && (
          <CategoryCarousel
            categories={categories}
            stats={stats}
            iconMap={iconMap}
            onCategoryClick={handleProblemCompRoute}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
