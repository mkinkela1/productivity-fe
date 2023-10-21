import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  PencilSquareIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";

export type TTailwindIcon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

type TSideMenuItem = {
  Icon: TTailwindIcon;
  label: string;
  href: string;
};

const menu: TSideMenuItem[] = [
  {
    Icon: HomeIcon,
    label: "Home",
    href: "/",
  },
  {
    Icon: CalendarIcon,
    label: "Calendar",
    href: "/calendar",
  },
  {
    Icon: PencilSquareIcon,
    label: "Notes",
    href: "/notes",
  },
  {
    Icon: ChatBubbleLeftIcon,
    label: "Chat",
    href: "/chat",
  },
  {
    Icon: TrophyIcon,
    label: "Rewards",
    href: "/rewards",
  },
];

const SideMenu = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 w-20 flex-shrink-0 border-r border-gray-200 flex-col hidden sm:flex">
      <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-4">
        {menu.map(({ Icon, label, href }) => (
          <a
            key={label}
            className={`h-10 w-12 rounded-md flex items-center justify-center ${
              pathname.includes(href)
                ? "dark:bg-gray-700 dark:text-white bg-blue-100 text-blue-500"
                : " dark:text-gray-500"
            }`}
            href={href}
          >
            <Icon className="h-5" title={label} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;