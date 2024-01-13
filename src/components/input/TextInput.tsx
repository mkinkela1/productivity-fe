import { useId } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";

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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">{label}</Label>
          <Input
            {...field}
            type={type}
            id={inputId}
            autoComplete={getAutocomplete()}
            placeholder="Email"
          />
          <div className="text-red-500 text-xs">{error?.message}</div>
        </div>
      )}
    />
  );
};

export default ControlledInput;
