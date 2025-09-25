import { SxProps, Box, Typography, Chip } from "@mui/material";
import {
  getStorageFileTypeFromName,
  StorageFile,
} from "../utils/StorageFiles.util";
import { useMemo } from "react";

export function FileItemsViewer({
  label,
  files = [],
  sx,
}: {
  label: string;
  files: StorageFile[];
  sx?: SxProps;
}) {
  const imageFiles = useMemo(
    () =>
      files.filter(
        (file) =>
          file?.fileName &&
          getStorageFileTypeFromName(file.fileName) === "image" &&
          file.imageUrl
      ),
    [files]
  );
  const otherFiles = useMemo(
    () =>
      files.filter(
        (file) =>
          file?.fileName &&
          getStorageFileTypeFromName(file.fileName) !== "image" &&
          file.imageUrl
      ),
    [files]
  );

  function handleOpenFile(fileUrl: string | undefined) {
    if (!fileUrl) return;
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
      {!files.length && (
        <Typography
          variant="body2"
          sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
        >
          No existing files
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {otherFiles.map((file, index) => (
          <Chip
            key={index}
            label={file.fileName}
            onClick={() => handleOpenFile(file.imageUrl)}
            style={{ margin: "0.5rem", cursor: "pointer" }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {imageFiles.map((file, index) => (
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
            onClick={() => handleOpenFile(file.imageUrl)}
          />
        ))}
      </Box>
    </Box>
  );
}
