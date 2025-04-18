import { useState } from 'react';
import { Outlet } from "react-router";
import MainMenu from "../components/MainMenu/MainManu";
import TopBarMenu from "../components/TopBarMenu/TopBarMenu";
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {

  const [menuCollapse, setMenuCollapse] = useState(false);

  const handleCollapseMenu = () => setMenuCollapse(prevState => !prevState);

  return (
    <div className="site-wrapper">
      <MainMenu 
        menuCollapse={menuCollapse}
        handleCollapseMenu={handleCollapseMenu}
      />
      <TopBarMenu />
      <main className={`main-content position-relative ${menuCollapse ? 'menu-collapse' : ''}`}>
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