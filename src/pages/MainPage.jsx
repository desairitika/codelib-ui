import { Outlet } from "react-router-dom";
import styles from "./MainPage.module.scss";
import Footer from "../components/common/footer/Footer";
import Header from "../components/common/header/Header";
import { useConstants } from "../hooks/useConstants";

const MainPage = () => {
  useConstants();

  return (
    <div className={styles.mainPage}>
      <Header></Header>
      <div className={styles.outlet}>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainPage;
