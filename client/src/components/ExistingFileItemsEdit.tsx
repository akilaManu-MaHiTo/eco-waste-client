import { SxProps, Box, Typography, Chip, IconButton } from "@mui/material";
import {
  getStorageFileTypeFromName,
  StorageFile,
} from "../utils/StorageFiles.util";
import { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function ExistingFileItemsEdit({
  label,
  files,
  sx,
  handleRemoveItem,
}: {
  label: string;
  files: StorageFile[];
  sx?: SxProps;
  handleRemoveItem: (file: StorageFile) => void;
}) {
  const imageFiles = useMemo(
    () =>
      files?.filter(
        (file) => getStorageFileTypeFromName(file.fileName) === "image"
      ),
    [files]
  );
  const otherFiles = useMemo(
    () =>
      files?.filter(
        (file) => getStorageFileTypeFromName(file.fileName) !== "image"
      ),
    [files]
  );

  function handleOpenFile(fileUrl: string) {
    window.open(fileUrl, "_blank")?.focus();
  }

  return (
    <Box
      sx={{
        ...sx,
        paddingY: "0.3rem",
        paddingX: "0.5rem",
        minWidth: "8rem",
      }}
    >
      <Typography
        variant="caption"
        sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
      >
        {label}
      </Typography>
      {!files?.length && (
        <Typography
          variant="body2"
          sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
        >
          No existing files
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {otherFiles?.map((file, index) => (
          <Chip
            key={index}
            label={file?.fileName}
            onClick={() => handleOpenFile(file?.imageUrl)}
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onDelete={() => {
              handleRemoveItem(file);
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {imageFiles?.map((file, index) => (
          <Box
            sx={{
              position: "relative",
            }}
          >
            <IconButton
              aria-label="edit"
              onClick={() => {
                handleRemoveItem(file);
              }}
              sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
            >
              <CloseIcon
                sx={{
                  color: "#fff",
                  backgroundColor: "var(--pallet-grey)",
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  padding: "0.2rem",
                }}
              />
            </IconButton>
            <Box
              key={index}
              sx={{
                width: "200px",
                height: "200px",
                margin: "0.5rem",
                cursor: "pointer",
                backgroundImage: `url(${file.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "0.5rem",
              }}
              onClick={() => handleOpenFile(file?.imageUrl)}
            ></Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
