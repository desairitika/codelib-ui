import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { getProblems } from "@services/problemService";
import styles from "./Sidebar.module.scss";

export default function Sidebar({ show, setShow, onSelectProblem, selectedProblemId }) {
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await getProblems();
        if (res?.data?.problems) {
          setProblemList(res.data.problems);
        } else {
          console.warn('No problems data in response:', res);
          setProblemList([]);
        }
      } catch (err) {
        console.error('Failed to fetch problems:', err);
        setProblemList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <>
      {show && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setShow(false)}
        />
      )}
      <div
        className={`${styles.sidebarExpanded} ${show ? styles.sidebarOpen : ''}`}
        style={{ pointerEvents: show ? 'auto' : 'none', width: '400px' }}
      >
        <List className={styles.sidebarMenu}>
          {loading && <div style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#888" }}>Loading problems...</div>}
          {!loading && problemList.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "30px 20px", 
              color: "#999",
              fontSize: "14px"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>📭</div>
              <p style={{ margin: "0", fontWeight: "500" }}>No problems available</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: "0.8" }}>Create a problem to get started</p>
            </div>
          )}
          {problemList.map((problem) => (
            <ListItem key={problem._id} disablePadding>
              <ListItemButton
                selected={selectedProblemId === problem._id}
                onClick={() => {
                  setShow(false);
                  onSelectProblem(problem);
                }}
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                <ListItemText primary={problem.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
}
