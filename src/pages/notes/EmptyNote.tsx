const EmptyNote = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="text-white font-medium text-3xl">Select a note</div>
        <div className="text-gray-400">or create a new one</div>
      </div>
    </div>
  );
};

export default EmptyNote;
