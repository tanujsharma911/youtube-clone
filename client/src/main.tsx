// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import Account from "./pages/Account.tsx";
import Upload from "./pages/Upload.tsx";
import Video from "./pages/Video.tsx";
import NotFound from "./pages/NotFound.tsx";
import Signup from "./pages/Signup.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authRequired={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authRequired={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/v/upload",
        element: (
          <AuthLayout authRequired>
            <Upload />
          </AuthLayout>
        ),
      },
      {
        path: "/account",
        element: (
          <AuthLayout authRequired>
            <Account />
          </AuthLayout>
        ),
      },
      {
        path: "/watch",
        element: (
          <AuthLayout>
            <Video />
          </AuthLayout>
        ),
      },
      {
        path: "/not-found",
        element: <NotFound />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
