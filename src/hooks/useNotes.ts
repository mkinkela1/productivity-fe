import { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "src/App";
import ApiCall from "src/endpoints/ApiCall";
import { GetNotesPaginatedData } from "src/endpoints/__generated__/Api";
import { NewNoteForm } from "src/pages/notes/NewNote";
import { NOTES_LIST } from "src/utils/QueryKeys";
import { isEmpty } from "src/utils/helpers";

type TNotesData = AxiosResponse<GetNotesPaginatedData>;
type TRemoveNote = {
  id: string;
};

const useNotes = () => {
  const queryKeys = [NOTES_LIST];
  const navigate = useNavigate();

  const { isLoading: areNotesLoading, data } = useQuery(
    queryKeys,
    ApiCall.getNotesPaginated,
  );

  const createNote = useMutation(
    async ({ title }: NewNoteForm) =>
      await ApiCall.createNote({ title, content: "" }),
    {
      onMutate: ({ title }: NewNoteForm) => {
        queryClient.cancelQueries([NOTES_LIST]);

        const previousNotes = queryClient.getQueryData<TNotesData>([
          NOTES_LIST,
        ]);
        const prevData = previousNotes?.data ?? [];
        const newData = [...prevData, { id: "newNote", title }];

        queryClient.setQueryData([NOTES_LIST], () => newData);

        return { newData };
      },
      onError: () => {
        toast.error("Failed to create note");
      },
      onSettled: (data) => {
        queryClient.invalidateQueries([NOTES_LIST]);
        toast.success("Note created");

        const id = data?.data?.id ?? "";

        if (isEmpty(id)) toast.error("Failed to open note.");

        navigate(`/app/notes/${id}`);
      },
    },
  );

  const removeNote = useMutation(
    async ({ id }: TRemoveNote) => await ApiCall.removeNote(id),
    {
      onMutate: ({ id }: TRemoveNote) => {
        queryClient.cancelQueries([NOTES_LIST]);

        const previousNotes = queryClient.getQueryData<TNotesData>([
          NOTES_LIST,
        ]);
        const prevData = previousNotes?.data ?? [];

        const newData = prevData.filter((note) => note.id !== id);

        queryClient.setQueryData([NOTES_LIST], () => newData);
      },
      onError: () => {
        toast.error("Failed to remove note");
      },
      onSettled: () => {
        queryClient.invalidateQueries([NOTES_LIST]);
        toast.success("Note removed");
      },
    },
  );

  const notes = data?.data ?? [];

  return { areNotesLoading, notes, createNote, removeNote };
};

export default useNotes;
