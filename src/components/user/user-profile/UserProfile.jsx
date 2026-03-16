import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { ImCamera } from "react-icons/im";
import { IoCloseSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "./UserProfile.module.scss";
import PicLoader from "../../common/loaders/PicLoader";
import maleDefault from "../../../assets/images/male.png";
import femaleDefault from "../../../assets/images/female.jpg";
import generalDefault from "../../../assets/images/general.png";
import defaultCover from "../../../assets/images/defaultCover.jpg";
import { getImageUrl } from "../../../utils/imageUtil";
import { getUser, updateUser, cancelToken } from "../../../services/userService";
import { validateForm, validators } from "../../../utils/validators";

const UserProfile = ({ profileData, showModal, closeModal }) => {
  const [coverLoading, setCoverLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [img, setImage] = useState("");
  const [cover, setCover] = useState("");
  const [userData, setUserData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const updateData = useCallback(
    async (payload, type) => {
      try {
        if (type === "cover") setCoverLoading(true);
        if (type === "img") setImgLoading(true);

        setLoading(true);
        const res = await updateUser(userData._id, payload);

        if (res?.user) {
          setUserData({
            ...res.user,
            img: getImageUrl(res.user.img),
            cover: getImageUrl(res.user.cover),
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userData._id]
  );

  const handleFileChange = (e) => {
    setFile(e?.target?.files[0]);
  };

  const handleUpload = (type) => {
    setAnchorEl(null);
    setUploadType(type);
    document.getElementById("fileInput").click();
  };

  useEffect(() => {
    if (file && uploadType) {
      updateData({ [uploadType]: file }, uploadType);
      setUploadType("");
      setFile(null);
    }
  }, [file, uploadType, updateData]);

  const handleDelete = (type) => {
    setAnchorEl(null);
    updateData({ [type]: "" }, type);
  };

  const handleEditProfileOpen = () => {
    setEditFormData({
      name: userData.name || "",
      lastname: userData.lastname || "",
      email: userData.email || "",
      username: userData.username || "",
      gender: userData.gender || "",
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (editErrors[name]) {
      setEditErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSaveProfile = async () => {
    // Validate form
    const rules = {
      name: {
        required: true,
        label: "Name",
        validator: validators.name,
      },
      email: {
        required: true,
        label: "Email",
        validator: validators.email,
      },
      username: {
        required: true,
        label: "Username",
        validator: validators.username,
      },
    };

    const validation = validateForm(editFormData, rules);
    
    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const updatePayload = {
        name: editFormData.name,
        lastname: editFormData.lastname,
        email: editFormData.email,
        username: editFormData.username,
        gender: editFormData.gender,
      };

      const res = await updateUser(userData._id, updatePayload);

      if (res?.user) {
        setUserData({
          ...res.user,
          img: getImageUrl(res.user.img),
          cover: getImageUrl(res.user.cover),
        });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tokenSource = cancelToken();
    setLoading(true);

    const getData = async () => {
      try {
        if (profileData?.id && profileData?.id !== userData?._id && showModal) {
          const res = await getUser(profileData.id, tokenSource.token);
          if (res?.user) {
            setUserData({
              ...res.user,
              img: getImageUrl(res.user.img),
              cover: getImageUrl(res.user.cover),
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData(profileData.id);

    return () => {
      tokenSource.cancel("Component unmounted: request canceled");
    };
  }, [profileData.id, userData?._id, showModal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && showModal) {
        if (!userData?.img) {
          switch (userData?.gender) {
            case "male":
              setImage(maleDefault);
              break;
            case "female":
              setImage(femaleDefault);
              break;
            default:
              setImage(generalDefault);
              break;
          }
        }
        if (!userData.cover) {
          setCover(defaultCover);
        }
        setCoverLoading(false);
        setImgLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [loading, userData, showModal]);

  return (
    <Modal show={showModal} onHide={closeModal} centered size="lg">
      <Modal.Header className={styles.header}>
        {coverLoading && <PicLoader width="100%" height="100%" />}
        <img
          src={userData?.cover || cover}
          alt=""
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.5s ease-in-out",
            opacity: coverLoading ? 0 : 1,
          }}
          onLoad={() => setCoverLoading(false)}
        />
        <Button
          aria-controls="cover-menu"
          className={`${styles["op-button"]} ${styles["cover-upload"]}`}
          variant="outlined"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          Edit Cover
        </Button>
        <Menu
          elevation={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id="cover-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem style={{ fontSize: "12px" }} onClick={() => handleUpload("cover")}>
            <FiUpload style={{ marginRight: "2px" }} />
            Upload
          </MenuItem>
          <MenuItem style={{ fontSize: "12px" }} onClick={() => handleDelete("cover")}>
            <AiOutlineDelete style={{ marginRight: "2px" }} />
            Delete
          </MenuItem>
        </Menu>
        <button aria-label="Close" className={styles["close-button"]} onClick={closeModal}>
          <IoCloseSharp size={25} />
        </button>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: 0 }}>
        <div className={styles.profileInfo}>
          <span className={styles["profile-menu"]}>
            <Button
              aria-controls="img-delete"
              className={`${styles["op-button"]} ${styles["img-delete"]}`}
              variant="outlined"
              aria-haspopup="true"
              onClick={() => handleDelete("img")}
            >
              Delete Profile Pic
            </Button>
            <Button
              aria-controls="edit-profile"
              className={`${styles["op-button"]} ${styles["img-delete"]}`}
              variant="outlined"
              aria-haspopup="true"
              onClick={handleEditProfileOpen}
            >
              Edit Profile
            </Button>
          </span>
          <div className={styles.imageContainer}>
            {imgLoading && <PicLoader width="100%" height="100%" />}
            <img src={userData.img || img} style={{ opacity: imgLoading ? 0 : 1 }} alt="" className={styles.image} loading="lazy" onLoad={() => setImgLoading(false)} />
            <div className={styles.changeImage} onClick={() => handleUpload("img")}>
              <ImCamera size="25" style={{ paddingBottom: "5px" }} fill={userData?.img ? "white" : ""} />
            </div>
          </div>
          <span style={{ marginLeft: "10px" }}>
            <h1>
              {userData.name ? userData.name : ""} {userData.lastname ? userData.lastname : ""}
            </h1>
            <h5 style={{ fontFamily: "monospace" }}>{userData.username ? userData.username : ""}</h5>
          </span>
        </div>
        <div className={styles.mainContent}></div>
        <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editErrors.submit && <Alert variant="danger">{editErrors.submit}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name || ""}
                onChange={handleEditInputChange}
                isInvalid={!!editErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={editFormData.lastname || ""}
                onChange={handleEditInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email || ""}
                onChange={handleEditInputChange}
                isInvalid={!!editErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editFormData.username || ""}
                onChange={handleEditInputChange}
                isInvalid={!!editErrors.username}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={editFormData.gender || ""}
                onChange={handleEditInputChange}
              >
                <option value="">--Select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

UserProfile.propTypes = {
  profileData: PropTypes.shape({
    id: PropTypes.string,
  }),
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default UserProfile;
