import type { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import { BrowserRouter } from "react-router-dom";

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
