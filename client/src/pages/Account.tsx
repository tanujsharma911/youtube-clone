// import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axios from "../api/axios";
import React from "react";

const Account = () => {
  //   const axiosPrivate = useAxios();

  React.useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get("/users/get-user");
        console.log("Account data:", response.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAccountData();
  }, []);

  return <div>Account</div>;
};

export default Account;
