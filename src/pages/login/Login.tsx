import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Button from "src/components/button/Button";
import TextInput from "src/components/input/TextInput";
import { object, string } from "yup";

const loginSchema = object({
  email: string().email().required("Email is required"),
  password: string().required("Password is required"),
});

const Login: React.FC = () => {
  const { control } = useForm({
    resolver: yupResolver(loginSchema),
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextInput control={control} fieldName="email" label="Email" />
          <TextInput control={control} fieldName="password" label="Password" />
          <Button label="Sign in" />

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
