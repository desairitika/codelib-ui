import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Row, Col, Badge } from "react-bootstrap";
import { CATEGORIES, DIFFICULTIES } from "@utils/constants";
import { createProblem, updateProblem, getTemplate, uploadTemplate, cancelToken } from "@services/problemService";
import { useToast } from "../../../../../hooks/useToast";
import { FaUpload, FaDownload } from "react-icons/fa";
import styles from "./AddProblem.module.scss";
import Chip from "@mui/material/Chip";

const AddProblem = ({ data, showModal, closeModal, refresh }) => {
  const isEditMode = data && Object.keys(data).length > 0;
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: [],
    category: "",
  });
  const [tagInput, setTagInput] = useState("");
  const { setToast } = useToast();

  useEffect(() => {
    if (isEditMode) {
      setProblem({
        title: data.title || "",
        description: data.description || "",
        difficulty: data.difficulty || "easy",
        tags: data.tags || [],
        category: data.category || "",
      });
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prevProblem) => ({
      ...prevProblem,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        setProblem((prevProblem) => ({
          ...prevProblem,
          tags: [...prevProblem.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setProblem((prevProblem) => ({
      ...prevProblem,
      tags: prevProblem.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    if (!problem.title.trim()) {
      setToast("Title is required", "Error", "warning");
      return false;
    }
    if (!problem.description.trim()) {
      setToast("Description is required", "Error", "warning");
      return false;
    }
    if (!problem.difficulty) {
      setToast("Please select a difficulty level", "Error", "warning");
      return false;
    }
    return true;
  };

  const handleSaveOrUpdate = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const tokenSource = cancelToken();
    try {
      let res;
      if (isEditMode) {
        res = await updateProblem(data._id, problem, tokenSource.token);
      } else {
        res = await createProblem(problem, tokenSource.token);
      }

      if (res.code === 201 || res.code === 200) {
        setToast(res.message);
        handleReset();
        closeModal();
        refresh();
      }
    } catch (error) {
      setToast(error?.message, "Error");
    }
  };

  const handleReset = () => {
    setProblem({
      title: "",
      description: "",
      difficulty: "easy",
      tags: [],
      category: "",
    });
    setTagInput("");
    document.getElementById("fileInput").value = null; // Clear file input
  };

  const handleTemplateDownload = async () => {
    try {
      const response = await getTemplate();
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.xlsx");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      setToast("Error downloading template.", "Error");
      console.error("Error downloading template:", error);
    }
  };

  const handleFileChange = (e) => {
    handleTemplateUpload(e.target.files[0]);
  };

  const handleTemplateUpload = async (file) => {
    if (!file) {
      setToast("Please select a file first.", "Error");
      return;
    }

    try {
      const response = await uploadTemplate(file);
      if (response.code === 200) {
        setToast(response.message, "Alert");
        closeModal();
        refresh();
      }
    } catch (error) {
      setToast("Error uploading file.", "Error");
      console.error("There was an error uploading the file:", error);
    } finally {
      handleReset(); // Clear the file and reset form
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered size="xl">
      <Modal.Header closeButton style={{ gap: "10px" }}>
        <Modal.Title>{isEditMode ? "Edit Problem" : "Add Problem"}</Modal.Title>
        <button className={styles.fileBtn} onClick={handleTemplateDownload} title="Download Template">
          <FaDownload /> <span className={styles.fileText}>Template</span>
        </button>
        <button className={styles.fileBtn} onClick={handleButtonClick} title="Upload Problems">
          <FaUpload /> <span className={styles.fileText}>Upload</span>
        </button>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="fileInput" />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label style={{ fontWeight: "600" }}>Title</Form.Label>
            <Form.Control type="text" required placeholder="Enter problem title" name="title" value={problem.title} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label style={{ fontWeight: "600" }}>Description</Form.Label>
            <Form.Control as="textarea" required rows={3} placeholder="Enter problem description" name="description" value={problem.description} onChange={handleChange} />
          </Form.Group>

          <Row className={`mb-3 ${styles.dropdownRow}`}>
            <Form.Group as={Col} controlId="formDifficulty">
              <Form.Label style={{ fontWeight: "600" }}>Difficulty</Form.Label>
              <Form.Select name="difficulty" required value={problem.difficulty} onChange={handleChange}>
                {DIFFICULTIES.map(
                  (item) =>
                    item.value && (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    )
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="formCategory">
              <Form.Label style={{ fontWeight: "600" }}>Category</Form.Label>
              <Form.Select name="category" value={problem.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formTags">
            <Form.Label style={{ fontWeight: "600" }}>Tags</Form.Label>
            <Form.Control type="text" placeholder="Enter tags and press Enter" value={tagInput} onChange={handleTagInputChange} onKeyPress={handleTagKeyPress} />
            <div className="mt-2">
              {Array.isArray(problem.tags) &&
                problem.tags.map((tag, index) => (
                  // <Badge key={index} pill bg="success" className="me-2">
                  //   {tag}{" "}
                  //   <span className="ms-1" onClick={() => handleTagRemove(tag)} style={{ cursor: "pointer" }}>
                  //     ×
                  //   </span>
                  // </Badge>
                  <Chip
                    key={index}
                    label={tag.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
                      return g1.toUpperCase() + g2.toLowerCase();
                    })}
                    variant="outlined"
                    color="secondary"
                    className="me-2"
                    size="small"
                    onClick={() => handleTagRemove(tag)}
                    onDelete={() => handleTagRemove(tag)}
                  ></Chip>
                ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleReset();
            closeModal();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleReset} variant="secondary">
          Reset
        </Button>
        <Button onClick={handleSaveOrUpdate}>{isEditMode ? "Update" : "Save"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProblem;
