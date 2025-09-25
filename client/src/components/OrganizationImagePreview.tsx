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

  if (!imageUrl || !resolvedImage) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      sx={{ mt: 2 }}
    >
      <Card
        sx={{
          width: "50%",
          height: "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={fileName}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Card>
    </Box>
  );
};

export default SingleImagePreview;
