import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import axios from "~/lib/axios";
import { User } from "~/types";

export default function useDBUser() {
  const { user } = useUser();

  const {
    data: dbUser,
    isPending: dBUserLoading,
    refetch: dbUserRefetch,
  } = useQuery({
    queryKey: ["db-user", user?.id],
    queryFn: async () => {
      const response = await axios.get("/api/users/me?clerk_id=" + user?.id);
      return response.data as User;
    },
    enabled: !!user?.id,
  });

  return {
    dbUser,
    dBUserLoading,
    dbUserRefetch,
  };
}
