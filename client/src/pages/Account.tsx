import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/store/auth";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const Account = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigate();
  const { logout } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get("/users/get-user", {
          withCredentials: true,
        });
        return res.data.data;
      } catch (error) {
        console.error("Account :: Error fetching user data:", error);
        return null;
      }
    },
  });

  const handleLogout = async () => {
    await axiosPrivate.post("/users/logout", {}, { withCredentials: true });
    logout();
    navigation("/");
  };

  const handleEditProfile = async () => {
    // Implement edit profile functionality
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  ) : (
    <div>
      <div className="flex items-center gap-5 justify-between">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user?.fullName}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleEditProfile}>
            Edit Profile
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
