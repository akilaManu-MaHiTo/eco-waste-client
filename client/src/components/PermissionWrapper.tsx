import React from "react";
import {
  defaultViewerPermissions,
  PermissionKeys,
} from "../views/Administration/SectionList";

interface Props {
  accessKey: PermissionKeys;
  children: React.ReactNode;
}

const PermissionWrapper: React.FC<Props> = ({ accessKey, children }: Props) => {
  const userPermissionObject = defaultViewerPermissions;

  if (!userPermissionObject[accessKey]) {
    return null;
  }

  return children;
};

export default PermissionWrapper;
