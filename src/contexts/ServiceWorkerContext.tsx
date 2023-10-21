import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { register, unregister } from "src/serviceWorker";
import { isNullOrUndefined } from "src/utils/helpers";

type TServiceWorkerContext = {
  isSwRegistered: boolean;
};

export const ServiceWorkerContext = createContext<TServiceWorkerContext | null>(
  null,
);

const ServiceWorkerContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isSwRegistered, setIsSwRegistered] = useState(false);

  useEffect(() => {
    register({ swUrl: "/tokens.js", onSuccess: () => setIsSwRegistered(true) });

    return () => unregister();
  }, []);

  return (
    <ServiceWorkerContext.Provider value={{ isSwRegistered }}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext);

  if (isNullOrUndefined(context)) {
    throw new Error(
      "useServiceWorker must be used within ServiceWorkerContextProvider",
    );
  }

  return context;
};

export default ServiceWorkerContextProvider;
