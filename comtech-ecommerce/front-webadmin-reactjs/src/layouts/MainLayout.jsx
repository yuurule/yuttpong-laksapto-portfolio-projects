import { Outlet } from "react-router";
import MainMenu from "../components/MainMenu/MainManu";
import TopBarMenu from "../components/TopBarMenu/TopBarMenu";
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {

  return (
    <div className="site-wrapper">
      <MainMenu />
      <TopBarMenu />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer
        theme="light"
        autoClose={3000}
        closeOnClick={true}
        newestOnTop={true}
      />
    </div>
  )
}

export default MainLayout;