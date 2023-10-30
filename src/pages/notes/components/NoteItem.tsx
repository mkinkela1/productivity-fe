import { TrashIcon } from "@heroicons/react/20/solid";

type Props = {
  id: string;
  title: string;
  onRemoveNote: () => void;
  onSelectNote: () => void;
};

const NoteItem: React.FC<Props> = ({
  id,
  title,
  onRemoveNote,
  onSelectNote,
}) => {
  return (
    <button
      className="p-2 w-full flex flex-col rounded-md bg-gray-800 hover:bg-gray-700"
      key={id}
      onClick={onSelectNote}
    >
      <div className="flex justify-between xl:flex-row flex-col items-center font-medium text-white w-full">
        {title}
        <button className="" onClick={onRemoveNote}>
          <TrashIcon className="h-4" />
        </button>
      </div>
    </button>
  );
};

export default NoteItem;
