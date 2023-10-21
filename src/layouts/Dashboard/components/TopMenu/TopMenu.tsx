import { BellIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";
import { useAuth } from "src/contexts/AuthContext";

type TMenuItem = {
  title: string;
  link: string;
};

const menu: TMenuItem[] = [
  {
    title: "Users",
    link: "/app/users",
  },
];

const TopMenu = () => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  return (
    <div className="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10">
      <div className="flex h-full text-gray-600 dark:text-gray-400">
        {menu.map(({ title, link }) => (
          <a
            key={title}
            href={link}
            className={`cursor-pointer h-full border-b-2 ${
              pathname.includes(link)
                ? "border-blue-500 text-blue-500  dark:text-white dark:border-white"
                : "border-transparent"
            } inline-flex items-center mr-8`}
          >
            {title}
          </a>
        ))}
      </div>
      <div className="ml-auto flex items-center space-x-7">
        <BellIcon className="w-6" />
        <button className="flex items-center">
          <span className="ml-2">{currentUser?.firstName}</span>
          <ChevronDownIcon className="w-4 ml-1 flex-shrink-0 stroke-2" />
        </button>
      </div>
    </div>
  );
};

export default TopMenu;
