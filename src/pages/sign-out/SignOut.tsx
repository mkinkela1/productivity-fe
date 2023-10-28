import { useEffect } from "react";
import { useAuth } from "src/contexts/AuthContext";

const SignOut: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex align-middle justify-center h-full">
      <h1>bye bye</h1>
    </div>
  );
};

export default SignOut;
