import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "src/components/input/TextInput";
import { Button } from "src/components/ui/button";
import { useAuth } from "src/contexts/AuthContext";
import { object, string } from "yup";

const loginSchema = object({
  email: string().email("Email is invalid").required("Email is required"),
  password: string()
    .test({
      test: function (val: string = "") {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;

        if (!regex.test(val)) {
          return this.createError({
            message:
              "Password needs to contain at least 8 characters, 1 capital letter, 1 small letter and 1 number",
          });
        }
        return true;
      },
    })
    .required("Password is required"),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSave = () => handleSubmit(login)();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-2">
          <TextInput control={control} fieldName="email" label="Email" />
          <TextInput
            control={control}
            fieldName="password"
            label="Password"
            type="password"
          />
          <div className="mt-2">
            <Button onClick={handleSave}>Sign in</Button>
          </div>

          <p className="mt-10 text-center text-sm text-input-label">
            Not a member?{" "}
            <a href="#" className="font-semibold leading-6 text-blue">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
