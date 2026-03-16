import styles from "./Problem.module.scss";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { MdEdit, MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Button, Badge } from "react-bootstrap";
import Chip from "@mui/material/Chip";
import { categoryMap, statusesMap, difficultyMap, difficultyColorMap } from "../../../../../utils/constants";
import { SiTicktick } from "react-icons/si";
import { MdRadioButtonUnchecked } from "react-icons/md";

const Problem = ({ problem, handleDelete, handleEdit, handleSolutionRoute }) => {
  return (
    <div className="w-100 d-flex flex-column justify-content-around">
      {problem ? (
        <Card className={`mt-1 w-100 position-relative ${styles.problemCard}`}>
          {/* colored stripe indicating difficulty */}
          <div
            className={styles.difficultyStripe}
            style={{ backgroundColor: difficultyColorMap[problem.difficulty] }}
          />
          <DropdownButton align="end" title={<CiMenuKebab fill="black" size={20} color="black" />} className={styles.menuBtn}>
            <Dropdown.Item eventKey="1" onClick={() => handleEdit(problem)}>
              <MdEdit /> Edit
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => handleDelete(problem._id)}>
              <MdDelete /> Delete
            </Dropdown.Item>
          </DropdownButton>
          <Card.Body className="p-1">
            <div className="mb-1">
              <Card.Title
                className={`m-0 text-muted ${styles.title}`}
                as="h5"
                style={{ width: "95%", cursor: "pointer" }}
                onClick={() => handleSolutionRoute(problem)}
              >
                {typeof problem.title === "string" ? problem.title : JSON.stringify(problem.title)}
              </Card.Title>
              {problem.description && (
                <Card.Text className="text-muted small m-0" as="p">
                  {problem.description.length > 120
                    ? problem.description.substring(0, 117) + "..."
                    : problem.description}
                </Card.Text>
              )}
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <span style={{ color: difficultyColorMap[problem.difficulty], fontWeight: 500, fontSize: "14px" }}>
                {categoryMap[problem.category]}
                {problem.difficulty && problem.category && " | "}
                {difficultyMap[problem.difficulty]}
              </span>
              <span className="d-flex align-items-center" style={{ gap: "4px" }}>
                <span className={styles.solutionCount} title="Number of submitted solutions">
                  {Object.keys(problem.solutions || {}).length}
                </span>
                <Chip
                  color={problem.status === "solved" ? "success" : "warning"}
                  icon={problem.status === "solved" ? <SiTicktick /> : <MdRadioButtonUnchecked />}
                  size="small"
                  label={statusesMap[problem.status]}
                />
              </span>
            </div>
            <div className={styles.actionRow}>
              <div className={styles.tags}>
                {problem.tags.map((tag, index) => (
                  // <Badge key={index} pill bg="primary" className="me-2">
                  //   {tag}
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
                    style={{ height: "16px" }}
                  />
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <>
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="my-1" style={{ width: "100%" }}>
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} /> <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default Problem;
