import React, { PropsWithChildren, createContext, useContext } from "react";
import { useQuery } from "react-query";
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
  const { isSwRegistered } = useServiceWorker();

  const {
    data,
    isLoading: isLoadingCurrentUser,
    refetch: reloadCurrentUser,
  } = useQuery([CURRENT_USER], ApiCall.getLoggedInUser, {
    enabled: isSwRegistered,
    retry: 1,
  });

  const currentUser = data?.data;

  const login = async (data: LoginDtoRequest) => {
    try {
      await ApiCall.login(data);
      await reloadCurrentUser();
      window.open("/app/home", "_self");
    } catch (error) {
      // TODO: add toastr to handle error
      console.log(error);
    }
  };

  const fullName = `${currentUser?.firstName} ${currentUser?.lastName}`;

  const logout = async () => {
    try {
      // this will be populated in service worker
      await ApiCall.logout({ accessToken: "", refreshToken: "" });
      await reloadCurrentUser();
    } catch (error) {
      // TODO: add toastr to handle error
    }
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
