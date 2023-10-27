import React, { PropsWithChildren, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useServiceWorker } from "src/contexts/ServiceWorkerContext";
import ApiCall from "src/endpoints/ApiCall";
import {
  GetLoggedInUserData,
  LoginDtoRequest,
} from "src/endpoints/__generated__/Api";
import { CURRENT_USER } from "src/utils/QueryKeys";
import { isNullOrUndefined } from "src/utils/helpers";

type TAuthContext = {
  currentUser?: GetLoggedInUserData;
  isLoadingCurrentUser: boolean;
  login: (data: LoginDtoRequest) => void;
  logout: () => void;
  fullName: string;
};

export const AuthContext = createContext<TAuthContext | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { isSwRegistered } = useServiceWorker();

  const {
    data,
    isLoading: isLoadingCurrentUser,
    refetch: reloadCurrentUser,
  } = useQuery([CURRENT_USER], ApiCall.getLoggedInUser, {
    enabled: isSwRegistered,
  });

  const currentUser = data?.data;

  const login = async (data: LoginDtoRequest) => {
    try {
      await ApiCall.login(data);
      await reloadCurrentUser();
      navigate("/app/home");
    } catch (error) {
      // TODO: add toastr to handle error
    }
  };

  const fullName = `${currentUser?.firstName} ${currentUser?.lastName}`;

  console.log(currentUser);

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
        fullName,
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
