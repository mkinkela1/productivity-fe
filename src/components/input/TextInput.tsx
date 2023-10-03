import { useId } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type InputType = "email" | "text" | "password";

type Props<Interface extends FieldValues> = {
  label: string;
  type?: InputType;
  control: Control<Interface>;
  fieldName: FieldPath<Interface>;
};

const ControlledInput = <Interface extends FieldValues>({
  label,
  type = "text",
  control,
  fieldName,
}: Props<Interface>) => {
  const inputId = useId();

  const getAutocomplete = () => {
    switch (fieldName) {
      case "email":
        return "email";
      case "password":
        return "current-password";
      default:
        return "off";
    }
  };

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-6 text-input-label"
          >
            {label}
          </label>
          <input
            {...field}
            id={inputId}
            type={type}
            autoComplete={getAutocomplete()}
            className="block bg-input-dark px-4 w-full rounded-md border-0 py-2 text-input-value"
          />
          <div className="text-red-500 text-xs">{error?.message}</div>
        </div>
      )}
    />
  );
};

export default ControlledInput;
