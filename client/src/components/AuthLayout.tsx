import React, { useEffect } from "react";
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

  useEffect(() => {
    if (!user) return;
    if (authRequired && !user.loggedIn) {
      navigate("/login");
    }
  }, []);

  return <div>{children}</div>;
};

export default AuthLayout;
