import { Outlet } from "react-router";
import MainMenu from "../components/MainMenu/MainManu";
import TopBarMenu from "../components/TopBarMenu/TopBarMenu";

const MainLayout = () => {

  return (
    <div className="site-wrapper">
      <MainMenu />
      <TopBarMenu />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout;