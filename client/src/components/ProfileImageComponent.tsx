import React from "react";
import Avatar from "@mui/material/Avatar";
import { getStorageFileTypeFromName } from "../utils/StorageFiles.util";

type StorageFile = {
  gsutil_uri?: string;
  imageUrl?: string;
  fileName?: string;
};

type ProfileImageProps = {
  name?: string;
  files?: (File | StorageFile)[];
  size?: string;
  fontSize?: string,
  onClick?: () => void;
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  name,
  files = [],
  size = "12rem",
  onClick,
  fontSize
}) => {
  const firstImageFile = files.find((file) => {
    const fileName = file instanceof File ? file.name : file.fileName;
    return getStorageFileTypeFromName(fileName || "") === "image";
  });

  const imageUrl =
    firstImageFile instanceof File
      ? URL.createObjectURL(firstImageFile)
      : firstImageFile?.imageUrl;

  return (
    <Avatar
      onClick={onClick}
      sx={{
        bgcolor: "var(--pallet-light-blue)",
        height: size,
        width: size,
        fontSize: {fontSize},
        cursor: onClick ? "pointer" : "default",
      }}
      src={imageUrl}
    >
      {!imageUrl && name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default ProfileImage;
