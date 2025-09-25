import useCurrentUser from "./useCurrentUser";
import { PermissionKeys } from "../views/Administration/SectionList";

function useCurrentUserHaveAccess(accessKey: PermissionKeys) {
  const { user } = useCurrentUser();

  return user?.permissionObject[accessKey] ?? false;
}

export default useCurrentUserHaveAccess;
