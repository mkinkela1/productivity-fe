import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "src/layouts/Dashboard/components/SideMenu/SideMenu";
import TopMenu from "src/layouts/Dashboard/components/TopMenu/TopMenu";

const DashboardLayout: React.FC<PropsWithChildren> = () => {
  return (
    <div className="bg-gray-900 text-white h-screen flex overflow-hidden text-sm">
      <SideMenu />
      <div className="flex-grow overflow-hidden h-full flex flex-col">
        <TopMenu />
        <div className="flex-grow flex overflow-x-hidden">
          <div className="flex-grow bg-gray-900 overflow-y-auto">
            <div className="flex flex-grow overflow-y-auto h-full flex-col w-full bg-gray-900 text-white sticky top-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
