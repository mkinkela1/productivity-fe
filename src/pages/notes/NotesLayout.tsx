import { Outlet } from "react-router-dom";
import NoteList from "src/pages/notes/components/NoteList";

const NotesLayout: React.FC = () => {
  return (
    <div className="flex-grow overflow-hidden h-full flex flex-col">
      <div className="flex-grow flex overflow-x-hidden">
        <div className="xl:w-72 w-48 flex-shrink-0 h-full overflow-y-auto lg:block hidden p-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900 scrollbar-thumb-rounded-md">
          <NoteList />
        </div>
        <div className="flex flex-grow overflow-y-auto p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
