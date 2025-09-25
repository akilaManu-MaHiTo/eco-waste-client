import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";

function DropzoneComponent({
  files,
  setFiles,
  dropzoneLabel,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
  dropzoneLabel?: string;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      setFiles([...files, ...acceptedFiles]);
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Stack direction={"column"} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", marginY: "0.3rem" }}>
        {files && files?.length > 0 && (
          <>
            {files?.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const fileURL = URL.createObjectURL(file);

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {isImage ? (
                    <Box
                      sx={{
                        backgroundImage: `url(${fileURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "120px",
                        height: "120px",
                        marginRight: "0.5rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${grey[500]}`,
                        position: "relative",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setFiles(files.filter((f) => f !== file));
                          URL.revokeObjectURL(fileURL); // Clean up the object URL
                        }}
                        size="small"
                        style={{
                          position: "absolute",
                          right: 4,
                          top: 4,
                          backgroundColor: grey[100],
                          fontSize: "0.1rem",
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Chip
                      label={file?.name}
                      sx={{ marginRight: "0.5rem" }}
                      onDelete={() => {
                        setFiles(files.filter((f) => f !== file));
                        URL.revokeObjectURL(fileURL); // Clean up the object URL
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </>
        )}
      </Box>
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          border: `1px dashed ${grey[700]}`,
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: grey[50],
          width: "100%",
          height: "100%",
          borderRadius: "4px",
        }}
      >
        <input {...getInputProps()} draggable />
        <Typography
          variant="body2"
          sx={{ color: grey[600], marginY: "0.3rem" }}
        >
          {dropzoneLabel
            ? `${dropzoneLabel}`
            : isDragActive
            ? "Drop the files here ..."
            : "Drag 'n' drop some files here, or click to select files"}
        </Typography>
      </Box>
    </Stack>
  );
}

export default DropzoneComponent;
