import { useQuery } from "@tanstack/react-query";
import { User, validateUser } from "../api/userApi"; // Ensure this import is correct

interface UseCurrentUserResult {
  user: User | undefined;
  status: "idle" | "loading" | "error" | "success" | "pending";
}

function useCurrentUser(): UseCurrentUserResult {
  const { data, status } = useQuery<User>({
    queryKey: ["current-user"],
    queryFn: validateUser,
  });

  return { user: data, status };
}

export default useCurrentUser;
