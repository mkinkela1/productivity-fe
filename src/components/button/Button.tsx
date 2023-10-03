type Props = {
  label: string;
  onClick: () => void;
};

const Button: React.FC<Props> = ({ label, onClick }) => {
  return (
    <button className="bg-blue rounded-md px-4 py-2 w-full" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
