import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "src/layouts/Dashboard/components/SideMenu/SideMenu";
import TopMenu from "src/layouts/Dashboard/components/TopMenu/TopMenu";

const DashboardLayout: React.FC<PropsWithChildren> = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm">
      <SideMenu />
      <div className="flex-grow overflow-hidden h-full flex flex-col">
        <TopMenu />
        <div className="flex-grow flex overflow-x-hidden">
          <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full bg-white dark:bg-gray-900 dark:text-white sticky top-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
