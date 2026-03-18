import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import CodeEditor from "./components/code-editor/CodeEditor";
import Sidebar from "./components/sidebar/Sidebar";
import SolutionSkeleton from "./components/solution-skeleton/SolutionSkeleton";
import CommentsSection from "./components/comments/CommentsSection";

import styles from "./Solution.module.scss";

import {
  createSolution,
  getSolution,
  updateSolution,
} from "@services/solutionService";

import { getProblemSolvers } from "@services/problemService";

import { useToast } from "../../../hooks/useToast";

const Solution = () => {
  const location = useLocation();
  const initialProblem = location.state?.problem;
  const { problemId } = useParams();

  const { setToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(initialProblem || null);

  const [code, setCode] = useState("");
  const [lang, setLanguage] = useState("javascript");

  const [solutionMap, setSolutionMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [commentRefresh, setCommentRefresh] = useState(0);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [solvers, setSolvers] = useState([]);

  const fetchSolution = async (id) => {
    setLoading(true);
    try {
      const res = await getSolution(id);

      if (res.code === 200) {
        setCode(res.data.code || "");
      } else {
        setCode("");
      }
    } catch {
      setCode("");
      setToast("Failed to fetch solution", "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedProblem?.solutions &&
      Object.keys(selectedProblem.solutions).length > 0
    ) {
      const langs = Object.keys(selectedProblem.solutions);
      const defaultLang = langs[0];

      setLanguage(defaultLang.toLowerCase());
      setSolutionMap(selectedProblem.solutions);

      fetchSolution(selectedProblem.solutions[defaultLang]);
    } else {
      setLanguage("javascript");
      setSolutionMap({});
      setCode("");
      setLoading(false);
    }
    
    // Fetch solvers
    if (selectedProblem?._id) {
      getProblemSolvers(selectedProblem._id).then(res => {
        if(res.code === 200) setSolvers(res.data);
      }).catch(err => console.error("Failed to load solvers", err));
    } else {
      setSolvers([]);
    }
  }, [selectedProblem]);

  const handleSave = async () => {
    try {
      const payload = {
        problem: selectedProblem?._id || problemId,
        code,
        language: lang.toUpperCase(),
      };

      if (solutionMap[payload.language]) {
        await updateSolution(solutionMap[payload.language], {
          code: payload.code,
        });
      } else {
        await createSolution(payload);
      }

      setCommentRefresh((prev) => prev + 1);

      setToast("Solution saved successfully", "Success");
    } catch (err) {
      setToast("Error saving solution. Please try again.", "Error");
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div className={styles.solutionWrapper}>
      <Sidebar
        show={sidebarOpen}
        setShow={setSidebarOpen}
        onSelectProblem={setSelectedProblem}
        selectedProblemId={selectedProblem?._id}
      />

      {selectedProblem && !loading && (
        <>
          <div className={styles.titleSection}>
            <div className={styles.headerRow}>
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className={styles.toggleButton}
                    onClick={() => setSidebarOpen(true)}
                  >
                    ☰
                  </button>

                  <h2 className={styles.title}>{selectedProblem.title}</h2>
                </div>

                <p className={styles.description}>
                  {selectedProblem.description}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className={styles.commentBtn}
                  onClick={() => setCommentsOpen(true)}
                >
                  Comments
                </button>

                <button className={styles.saveBtn} onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>

            {solvers.length > 0 && (
              <div className={styles.solversSection} style={{ marginTop: "10px", fontSize: "0.9rem", color: "#888" }}>
                <strong>Solved by: </strong>
                {solvers.map(u => u.username || u.name).join(", ")}
              </div>
            )}

            {selectedProblem.tags?.length > 0 && (
              <div className={styles.tags}>
                {selectedProblem.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.playgroundContainer}>
            <CodeEditor
              lang={lang}
              solution={code}
              setSolution={setCode}
              setLang={setLanguage}
              handleCodeChange={handleCodeChange}
            />
          </div>

          {commentsOpen && (
            <div
              className={styles.modalBackdrop}
              onClick={() => setCommentsOpen(false)}
            >
              <div
                className={styles.commentsModal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h3>Comments</h3>

                  <button
                    className={styles.closeModalBtn}
                    onClick={() => setCommentsOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <CommentsSection
                    solutionId={solutionMap[lang?.toUpperCase()] || ""}
                    refreshFlag={commentRefresh}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {selectedProblem && loading && <SolutionSkeleton />}
    </div>
  );
};

export default Solution;
