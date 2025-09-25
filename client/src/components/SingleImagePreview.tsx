import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useIsMobile from "../customHooks/useIsMobile";

type StorageFile = {
  signedUrl?: string;
  imageUrl?: string;
  fileName?: string;
  gsutil_uri?: string;
};

type Props = {
  image?: StorageFile | File | (StorageFile | File)[];
  label?: string;
  onRemove?: (file: StorageFile | File) => void;
};

const getPreviewUrl = (file: StorageFile | File): string | undefined => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  } else if ("signedUrl" in file) {
    return file.signedUrl;
  } else if ("imageUrl" in file) {
    return file.imageUrl;
  }
  return undefined;
};

const getFileName = (file: StorageFile | File): string => {
  if (file instanceof File) {
    return file.name;
  } else if (file.fileName) {
    return file.fileName;
  }
  return "Unnamed file";
};

const SingleImagePreview: React.FC<Props> = ({
  image,
  label = "Image",
  onRemove,
}) => {
  const resolvedImage = Array.isArray(image) ? image[0] : image;
  const imageUrl = resolvedImage ? getPreviewUrl(resolvedImage) : null;
  const fileName = resolvedImage ? getFileName(resolvedImage) : "";
  const { isMobile } = useIsMobile();
  if (!imageUrl || !resolvedImage) return null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <img
        src={imageUrl}
        alt={fileName}
        style={{
          maxWidth: isMobile ? 300 : "50vw",
          maxHeight: isMobile ? 300 : "50vh",
          objectFit: "contain",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "1rem",
        }}
      />
    </Box>
  );
};

export default SingleImagePreview;
