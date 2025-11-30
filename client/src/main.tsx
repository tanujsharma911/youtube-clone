import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import Account from "./pages/Account.tsx";

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
      // {
      //   path: "/signup",
      //   element: (
      //     <AuthLayout authRequired={false}>
      //       <Signup />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/create-article",
      //   element: (
      //     <AuthLayout authenticationRequired>
      //       {" "}
      //       <AddPost />
      //     </AuthLayout>
      //   ),
      // },
      {
        path: "/account",
        element: (
          <AuthLayout authRequired>
            <Account />
          </AuthLayout>
        ),
      },
      // {
      //   path: "/edit-post/:slug",
      //   element: (
      //     <AuthLayout authenticationRequired>
      //       {" "}
      //       <EditPost />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/post/:slug",
      //   element: <Post />,
      // },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
