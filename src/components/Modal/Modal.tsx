import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "src/components/button/Button";

type Props = {
  title: string;
  content: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
};

const Modal: FC<Props> = ({ title, content, onClose, onConfirm }) => {
  return createPortal(
    <div className="fixed top-0 left-0 flex justify-center items-center z-50 w-full h-full overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-xl max-h-full">
        <div className="relative  rounded-lg shadow bg-gray-900">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="flex flex-col px-6 py-6 lg:px-8 gap-6">
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <div className="space-y-6 overflow-y-auto">{content}</div>
            <div className="flex lg:flex-row flex-col gap-2">
              <Button label="Close" onClick={onClose} type="secondary" />
              <Button label="Confirm" onClick={onConfirm} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement,
  );
};

export default Modal;
