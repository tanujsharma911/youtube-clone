import React from "react";
import { useNavigate } from "react-router";

import useAuth from "@/store/auth";

const AuthLayout = ({
  children,
  authRequired = false,
}: {
  children: React.ReactNode;
  authRequired?: boolean;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (authRequired && !user) {
    navigate("/login");
    return null;
  }

  return <div>{children}</div>;
};

export default AuthLayout;
