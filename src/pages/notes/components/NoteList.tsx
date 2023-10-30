import { PlusIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "src/components/SearchInput/SearchInput";
import useNotes from "src/hooks/useNotes";
import NoteItem from "src/pages/notes/components/NoteItem";

const NoteList = () => {
  const { notes, removeNote } = useNotes();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Link
        to="/app/notes/new"
        state={{ background: location }}
        className="p-3 w-full flex flex-col rounded-md bg-gray-900 shadow mb-4 border border-gray-800"
      >
        <div className="flex flex-row items-center w-full">
          <div className="text-white font-medium">Add new note</div>
          <PlusIcon className="ml-auto h-5 text-gray-400" />
        </div>
      </Link>
      <SearchInput />

      <div className="mt-3 flex flex-col gap-2">
        {notes?.map(({ id, title }) => (
          <NoteItem
            key={`note-${id}`}
            id={id}
            title={title}
            onRemoveNote={() => removeNote.mutate({ id })}
            onSelectNote={() => navigate(`/app/notes/${id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default NoteList;
