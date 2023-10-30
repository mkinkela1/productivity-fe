import { Menu, Transition } from "@headlessui/react";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "src/contexts/AuthContext";

type TMenuItem = {
  title: string;
  link: string;
};

const menu: TMenuItem[] = [];

const userDropdownMenu: TMenuItem[] = [
  {
    title: "Account settings",
    link: "/app/account-settings",
  },
  {
    title: "Sign out",
    link: "/app/sign-out",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const TopMenu = () => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  return (
    <div className="lg:flex w-full border-b border-gray-800 hidden px-10">
      <div className="flex h-full text-gray-400">
        {menu.map(({ title, link }) => (
          <Link
            key={title}
            to={link}
            className={`cursor-pointer h-full border-b-2 ${
              pathname.includes(link)
                ? " text-white border-white"
                : "border-transparent"
            } inline-flex items-center mr-8`}
          >
            {title}
          </Link>
        ))}
      </div>
      <div className="py-4 ml-auto flex items-center space-x-7">
        <BellIcon className="w-6" />
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center">
              <span className="ml-2">{currentUser?.firstName}</span>
              <ChevronDownIcon className="w-4 ml-1 flex-shrink-0 stroke-2" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900  shadow-lg border border-gray-800 focus:outline-none">
              <div className="py-1">
                {userDropdownMenu.map(({ title, link }) => (
                  <Menu.Item key={title}>
                    {({ active }) => (
                      <Link
                        to={link}
                        className={classNames(
                          active ? "bg-gray-700 text-white" : " text-gray-500",
                          "text-white",
                          "block px-4 py-2 text-sm",
                        )}
                      >
                        {title}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default TopMenu;
