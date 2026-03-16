import styles from "./Problems.module.scss";
import { useState, useEffect, useRef, useCallback } from "react";
import { MdAddCard, MdOutlineRefresh } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { Pagination } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import ProblemFilter from "./components/problemFilter/ProblemFilter";
import AddProblem from "./components/add-problem/AddProblem";
import Problem from "./components/problem/Problem";
import ProblemSkeleton from "./components/problem-skeleton/ProblemSkeleton";
import { deleteProblem, getFilteredProblems } from "@services/problemService";
import { useToast } from "../../../hooks/useToast";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";

const Problems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refresh, setRefresh] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [showEditProblem, setShowEditProblem] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState();
  const [problemsPerPage, setProblemsPerPage] = useState(10);
  const [pagesToShow, setPagesToShow] = useState(4);
  const [paginationSize, setPaginationSize] = useState("");
  const [routedFilter, setRoutedFilter] = useState({});
  const filterRef = useRef(null);
  const { setToast } = useToast();

  // Debounce filter changes (300ms) to prevent excessive API calls
  const debouncedSetFilters = useDebounceCallback(
    useCallback((newFilters) => {
      setDebouncedFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    }, []),
    300
  );

  // Update debounced filters when filters change
  useEffect(() => {
    debouncedSetFilters(filters);
  }, [filters, debouncedSetFilters]);

  useEffect(() => {
    const updatePaginationPages = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setPaginationSize("sm");
        setPagesToShow(2);
      } else if (width < 768) {
        setPaginationSize("");
        setPagesToShow(4);
      } else {
        setPaginationSize("");
        setPagesToShow(5);
      }
    };
    updatePaginationPages();
    window.addEventListener("resize", updatePaginationPages);
    return () => {
      window.removeEventListener("resize", updatePaginationPages);
    };
  }, []);

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1]; // Only one page

    const pageNumbers = [];
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(page);
    }

    const result = [];
    if (startPage > 1) {
      result.push(1);
      if (startPage > 2) result.push("...");
    }

    result.push(...pageNumbers);

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) result.push("...");
      result.push(totalPages);
    }

    return result;
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsFilterOpen(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (problem) => {
    setSelectedProblem(problem);
    setShowEditProblem(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProblem(id);
      handleRefresh();
    } catch (e) {
      console.error(e.message);
      setToast(e?.message || "Failed to delete problem", "Error");
    }
  };

  const handleSolutionRoute = (problem) => {
    navigate(`/solution/${problem._id}`, {
      state: { problem },
    });
  };

  useEffect(() => {
    if (location.state) {
      // setFilters(location.state);
      setRoutedFilter(location.state)
    }
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await getFilteredProblems(debouncedFilters, currentPage, problemsPerPage);
        if (res.code === 200) {
          setProblemsList(res.data.problems);
          setTotalProblems(res.data.totalCount);
          setTotalPages(Math.ceil(res.data.totalCount / problemsPerPage));
        }
      } catch (e) {
        console.error(e);
        setToast(e?.message || "Failed to fetch problems", "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [refresh, debouncedFilters, currentPage, problemsPerPage, setToast]);

  const handleRefresh = () => setRefresh((prevRefresh) => prevRefresh + 1);

  const handleAddProblemClick = () => {
    setSelectedProblem(null);
    setShowAddProblem(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setProblemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className={styles.problemPage}>
      <div className={styles.filterContentContainer}>
        <div className={`${styles.filterPane} ${isFilterOpen ? styles.open : ""}`} ref={filterRef}>
          <h3 className="mb-2 p-2 border-bottom">Filters</h3>
          <ProblemFilter routedFilter={routedFilter} onFilterChange={handleFilterChange} handleItemsPerPageChange={handleItemsPerPageChange} />
          <div className={`d-flex bg-secondary text-light ${styles.label} ${styles.count}`}>
            <span>Filtered Items : </span>
            <span style={{ fontSize: "16px" }}>{totalProblems}</span>
          </div>
        </div>
        {isFilterOpen && <div className={styles.backdrop} onClick={toggleFilter} />}
        <div className={styles.contentPane}>
          <div className="pb-2 position-relative d-flex flex-row justify-content-between align-items-center border-bottom">
            <h3 className="m-0">Problems</h3>
            <div className="d-flex flex-row align-items-center" style={{ gap: "5px" }}>
              <button className={styles.addBtn} title="Refresh" onClick={handleRefresh}>
                <MdOutlineRefresh size={25} />
              </button>
              <button
                className={`${styles.addBtn} d-flex flex-row align-items-center`}
                title="Add Problem"
                onClick={handleAddProblemClick}
                style={showAddProblem && !selectedProblem ? { background: "#007bff", color: "white" } : {}}
              >
                <MdAddCard size={25} /> <span style={{ fontWeight: 500, marginLeft: "5px" }}>Add</span>
              </button>
              <button
                title="Filter"
                className={`${styles.filterToggleBtn} flex-row align-items-center`}
                onClick={toggleFilter}
                style={isFilterOpen ? { background: "#007bff", color: "white" } : {}}
              >
                <FaFilter /> <span style={{ fontWeight: 500, marginLeft: "5px" }}>Filter</span>
              </button>
            </div>
          </div>
          <div className={`${styles.problemsList} ${!loading && problemsList.length === 0 ? styles.emptyState : ''}`}>
            {loading && <ProblemSkeleton count={problemsPerPage} />}
            {!loading && problemsList.length === 0 && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                textAlign: "center",
                padding: "40px 20px",
                background: "linear-gradient(135deg, rgba(240, 240, 240, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)",
              }}>
                {/* Decorative SVG Illustration */}
                <svg width="220" height="200" viewBox="0 0 200 200" style={{ marginBottom: "30px", opacity: 0.8 }}>
                  {/* Background circles */}
                  <circle cx="50" cy="50" r="35" fill="#f0f0f0" opacity="0.3" />
                  <circle cx="160" cy="140" r="45" fill="#f0f0f0" opacity="0.2" />
                  
                  {/* Main document/list shape */}
                  <rect x="50" y="40" width="100" height="120" rx="8" fill="none" stroke="#b0b0b0" strokeWidth="2" />
                  <line x1="60" y1="60" x2="140" y2="60" stroke="#d0d0d0" strokeWidth="2" />
                  <line x1="60" y1="80" x2="140" y2="80" stroke="#d0d0d0" strokeWidth="2" />
                  <line x1="60" y1="100" x2="140" y2="100" stroke="#d0d0d0" strokeWidth="2" />
                  
                  {/* Magnifying glass */}
                  <circle cx="140" cy="50" r="30" fill="none" stroke="#b0b0b0" strokeWidth="2" />
                  <line x1="160" y1="70" x2="178" y2="88" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Decorative plus signs */}
                  <text x="30" y="35" fontSize="20" fill="#d0d0d0">+</text>
                  <text x="165" y="25" fontSize="20" fill="#d0d0d0">+</text>
                  <text x="175" y="155" fontSize="20" fill="#d0d0d0">+</text>
                </svg>

                <h2 style={{ 
                  fontSize: "28px", 
                  fontWeight: "700", 
                  margin: "0 0 12px 0", 
                  color: "#2c3e50",
                  letterSpacing: "-0.5px"
                }}>No Data Found</h2>
                <p style={{ 
                  fontSize: "16px", 
                  color: "#7f8c8d", 
                  margin: "0", 
                  maxWidth: "400px", 
                  lineHeight: "1.6",
                  fontWeight: "400"
                }}>There is no data to show you right now</p>
              </div>
            )}
            {!loading &&
              problemsList.length > 0 &&
              problemsList.map((problem) => (
                <Problem key={problem._id} problem={problem} handleDelete={handleDelete} handleEdit={handleEdit} handleSolutionRoute={handleSolutionRoute} />
              ))}
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            <Pagination size={paginationSize} style={{ margin: 0 }}>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

              {totalPages >= 1 &&
                getPageNumbers().map((item, index) =>
                  item === "..." ? (
                    <Pagination.Ellipsis key={`ellipsis-${index}`} />
                  ) : (
                    <Pagination.Item key={`page-${item}`} active={item === currentPage} onClick={() => handlePageChange(item)}>
                      {item}
                    </Pagination.Item>
                  )
                )}

              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </div>
      </div>
      <AddProblem
        showModal={showAddProblem}
        refresh={handleRefresh}
        closeModal={() => {
          setShowAddProblem(false);
        }}
      />
      <AddProblem
        data={selectedProblem}
        showModal={showEditProblem}
        refresh={handleRefresh}
        closeModal={() => {
          setShowEditProblem(false);
          setSelectedProblem(null);
        }}
      />
    </div>
  );
};

export default Problems;
