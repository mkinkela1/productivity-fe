type ButtonType = "primary" | "secondary";

type Props = {
  label: string;
  onClick: () => void;
  type?: ButtonType;
};

const buttonTypeStyle: Record<ButtonType, string> = {
  primary: "bg-blue-500 hover:bg-blue-600",
  secondary: "",
};

const Button: React.FC<Props> = ({ label, onClick, type = "primary" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center p-2 border border-transparent rounded-md text-base font-medium text-white ${buttonTypeStyle[type]}`}
    >
      {label}
    </button>
  );
};

export default Button;
