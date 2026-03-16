import React, { useEffect, useState, useLayoutEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { VscCircleFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import styles from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../../redux/actions/authActions";
import UserProfile from "../../user/user-profile/UserProfile";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [expandedToggleButton, setExpandedToggleButton] = useState(false);
  const [showUserFrofile, setShowUserProfile] = useState(false);
  const [align, setAlign] = useState("end");
  const [initials, setInitials] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleButton = () => {
    setExpanded(false);
    setTimeout(() => {
      setExpandedToggleButton(false);
    }, 300);
  };

  const handleLinkClick = (link) => {
    handleToggleButton();
    setTimeout(() => {
      navigate(link);
    });
  };

  const closeModal = () => {
    setShowUserProfile(false);
  };

  // useEffect(() => {
  //   if (!expanded) {
  //     setTimeout(() => {
  //       setExpandedToggleButton(false);
  //     }, 300);
  //   } else if (expanded) {
  //     setExpandedToggleButton(true);
  //   }
  // }, [expanded]);

  useEffect(() => {
    if (user?.name && user?.lastname) {
      setInitials(user.name.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase());
    }
  }, [user]);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 992px)");
    const handleMediaQueryChange = (event) => {
      setAlign(event.matches ? "start" : "end");
    };

    setAlign(window.innerWidth < 992 ? "start" : "end");
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg" expanded={expanded} className="codelib-nav p-1 align-items-center">
        <Navbar.Brand className="d-flex align-items-center mx-2" style={{cursor:'pointer'}} onClick={() => navigate("/")}>
          CodeLib
        </Navbar.Brand>

        {expandedToggleButton && <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggleButton} className={styles.toggleButton} />}

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => handleLinkClick("/problems")}>Problems</Nav.Link>
            <Nav.Link onClick={() => handleLinkClick("/play-ground")}>Play Ground</Nav.Link>
            {user?.role === "admin" && <Nav.Link onClick={() => handleLinkClick("/user-management")}>User Management</Nav.Link>}
          </Nav>
        </Navbar.Collapse>

        {!expandedToggleButton && (
          <div className="d-flex flex-row align-items-center">
            <Nav className={"flex-row align-items-center " + styles.userInfo}>
              <Navbar.Text className="mx-1" style={{ color: "whitesmoke", display: "flex" }}>
                <VscCircleFilled size={25} color="green"></VscCircleFilled>
                {user?.name ? user.name : ""}
              </Navbar.Text>
              <Nav.Link className="mx-1">
                <IoNotifications size={25}></IoNotifications>
              </Nav.Link>
              <NavDropdown
                className={`mx-1 ${styles.initials}`}
                title={initials ? <span className={styles.menu}>{initials}</span> : <MdAccountCircle size={30} />}
                align={{ lg: align }}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setShowUserProfile(true);
                  }}
                >
                  <CgProfile size={20} /> Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    dispatch(logoutAction());
                  }}
                >
                  <TbLogout2 size={20} /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {!expandedToggleButton && (
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                onClick={() => {
                  setExpanded(true);
                  setExpandedToggleButton(true);
                }}
                className={styles.toggleButton}
              />
            )}
          </div>
        )}
      </Navbar>
      <UserProfile profileData={user} showModal={showUserFrofile} closeModal={closeModal}></UserProfile>
    </>
  );
};

export default Header;
