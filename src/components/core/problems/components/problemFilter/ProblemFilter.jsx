import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import useDebounce from "../../../../../hooks/useDebounce"; // Adjust the path as necessary
import styles from "./ProblemFilter.module.scss";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "@utils/constants";

const ProblemFilter = ({ onFilterChange, handleItemsPerPageChange, routedFilter }) => {
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    status: "",
    title: "",
  });

  useEffect(() => {
    if (routedFilter) {
      setFilters((prev) => ({
        ...prev,
        ...routedFilter,
      }));
      onFilterChange(routedFilter);
    }
  }, [routedFilter]);

  // Debounce the title field
  const debouncedTitle = useDebounce(filters.title, 500);

  // Trigger onFilterChange only when the debouncedTitle changes
  useEffect(() => {
    const newFilters = { ...filters, title: debouncedTitle };
    onFilterChange(newFilters);
  }, [debouncedTitle]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (name !== "title") onFilterChange(newFilters);
  };

  return (
    <div style={{ position: "relative", padding: '5px', maxHeight: "80vh", overflow: "auto" }}>
      <Form>
        <Form.Group className={styles.group} controlId="title">
          <Form.Label className={styles.label}>Items Per Page</Form.Label>
          <Form.Select aria-label="Default select example" onChange={handleItemsPerPageChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className={styles.group} controlId="title">
          <Form.Label className={styles.label}>Title</Form.Label>
          <Form.Control name="title" placeholder="Enter Title" value={filters.title} onChange={handleFilterChange} />
        </Form.Group>

        <Form.Group className={styles.group} controlId="category">
          <Form.Label className={styles.label}>Category</Form.Label>
          <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">Select Category</option>
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className={styles.group} controlId="difficulty">
          <Form.Label className={styles.label}>Difficulty</Form.Label>
          <Form.Select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
            {DIFFICULTIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className={styles.group} controlId="status">
          <Form.Label className={styles.label}>Status</Form.Label>
          <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
            {STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ProblemFilter;
