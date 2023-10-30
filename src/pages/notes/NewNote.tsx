import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Modal from "src/components/Modal/Modal";
import TextInput from "src/components/input/TextInput";
import useNotes from "src/hooks/useNotes";
import * as yup from "yup";

const newNoteSchema = yup.object().shape({
  title: yup.string().required(),
});

export type NewNoteForm = yup.InferType<typeof newNoteSchema>;

const NewNote = () => {
  const { createNote } = useNotes();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(newNoteSchema),
    defaultValues: { title: "" },
  });

  const onClose = () => navigate(-1);

  const onConfirm = () =>
    handleSubmit(async ({ title }: NewNoteForm) => {
      try {
        createNote.mutate({ title });
      } catch (error) {
        toast.error("Could not create a new note");
      }
    })();

  return (
    <Modal
      title="Create a new note"
      content={
        <>
          <TextInput control={control} fieldName="title" label="Title" />
        </>
      }
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default NewNote;
