import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import ApiCall from "src/endpoints/ApiCall";
import {
  GetLoggedInUserData,
  LoginDtoRequest,
} from "src/endpoints/__generated__/Api";
import { CURRENT_USER } from "src/utils/QueryKeys";
import { isNullOrUndefined } from "src/utils/helpers";

type TAuthContext = {
  currentUser: GetLoggedInUserData | null;
  isLoadingCurrentUser: boolean;
  login: (data: LoginDtoRequest) => void;
  logout: () => void;
};

export const AuthContext = createContext<TAuthContext | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<GetLoggedInUserData | null>(
    null,
  );
  const navigate = useNavigate();

  const { isLoading: isLoadingCurrentUser, refetch: reloadCurrentUser } =
    useQuery([CURRENT_USER], ApiCall.getLoggedInUser, {
      onSuccess: (data: GetLoggedInUserData) => setCurrentUser(data),
      onError: () => setCurrentUser(null),
      retry: false,
    });

  const login = async (data: LoginDtoRequest) => {
    try {
      await ApiCall.login(data);
      await reloadCurrentUser();
      navigate("/users");
    } catch (error) {
      // TODO: add toastr to handle error
    }
  };

  const logout = () => {
    reloadCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        currentUser,
        isLoadingCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (isNullOrUndefined(context)) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return context;
};

export default AuthContextProvider;
