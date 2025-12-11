import { Outlet } from "react-router";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";

import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAuth from "./store/auth";
import { useQuery } from "@tanstack/react-query";

function App() {
  const axiosPrivate = useAxiosPrivate();
  const { user, login } = useAuth();

  console.log("VITE_SERVER at build:", import.meta.env.VITE_SERVER);

  const { isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      console.log("App :: User logged in?", user.loggedIn);
      try {
        console.log(
          "App :: Fetching user data on app load with the help of cookies"
        );
        const res = await axiosPrivate.get("/users/get-user", {
          withCredentials: true,
        });
        console.log("App :: User data:", res.data);
        login(res.data.data);
        return res.data.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        console.log(
          "App :: Trying to login user failed -> no valid cookies found"
        );
        return null;
      }
    },
    enabled: !user.loggedIn,
  });

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  ) : (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="px-5 md:px-20 mt-20 pb-20">
        <Outlet />
      </div>
      <Toaster richColors />
    </div>
  );
}

export default App;
