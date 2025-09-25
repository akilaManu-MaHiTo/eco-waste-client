import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import {
  Organization,
  ColorPallet,
  ColorPalletSchema,
  updateOrganization,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { ChromePicker } from "react-color";
import theme from "../../../theme";
import RichTextComponent from "../../../components/RichTextComponent";
import useIsMobile from "../../../customHooks/useIsMobile";
import { StorageFile } from "../../../utils/StorageFiles.util";
import ImagePreview from "../../../components/OrganizationImagePreview";
import CustomButton from "../../../components/CustomButton";
import SingleImagePreview from "../../../components/SingleImagePreview";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import { useSnackbar } from "notistack";

interface Props {
  open: boolean;
  handleClose: () => void;
  defaultValues: Organization;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const EditOrganizationDialog = ({
  open,
  handleClose,
  defaultValues,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const [logoUrls, setLogoUrls] = useState<(StorageFile | File)[]>(() => {
    const logos = defaultValues.logoUrl;
    if (Array.isArray(logos)) return logos;
    if (logos) return [logos];
    return [];
  });

  const [insightUrl, setInsightUrl] = useState<(StorageFile | File)[]>(() => {
    const insight = defaultValues.insightImage;
    if (Array.isArray(insight)) return insight;
    if (insight) return [insight];
    return [];
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Organization>({
    defaultValues: {
      logoUrl: [],
      // insightImage: [],
      ...defaultValues,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const resetForm = () => {
    reset();
    setFiles([]);
  };

  const parsedColorPallet = useMemo<ColorPallet[]>(() => {
    if (!defaultValues?.colorPallet) return [];

    // Default empty palette if nothing exists
    const defaultPalette: ColorPallet = {
      palletId: 0,
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      buttonColor: "#0000ff",
    };

    try {
      if (typeof defaultValues.colorPallet === "string") {
        const palletArrayString = JSON.parse(defaultValues.colorPallet);
        const palletArray = Array.isArray(palletArrayString)
          ? palletArrayString
          : [palletArrayString];

        const result = palletArray
          .map((pallet) => {
            const parsed =
              typeof pallet === "string" ? JSON.parse(pallet) : pallet;
            return ColorPalletSchema.safeParse(parsed);
          })
          .filter((result) => result.success)
          .map((result) => result.data);

        return result.length > 0 ? result : [defaultPalette];
      }

      // Handle already parsed array case
      const result = defaultValues.colorPallet
        .map((pallet) => ColorPalletSchema.safeParse(pallet))
        .filter((result) => result.success)
        .map((result) => result.data);

      return result.length > 0 ? result : [defaultPalette];
    } catch (error) {
      console.error("Error parsing color pallet:", error);
      return [defaultPalette];
    }
  }, [defaultValues]);

  const [formData, setFormData] = useState<Organization>(() => ({
    ...defaultValues,
    colorPallet:
      parsedColorPallet.length > 0
        ? parsedColorPallet
        : [
            {
              palletId: 0,
              primaryColor: "#000000",
              secondaryColor: "#ffffff",
              buttonColor: "#0000ff",
            },
          ],
  }));

  useEffect(() => {
    setFormData((prev) => ({
      ...defaultValues,
      colorPallet:
        parsedColorPallet.length > 0 ? parsedColorPallet : prev.colorPallet,
    }));
  }, [defaultValues, parsedColorPallet]);

  const handleSubmitOrganization = (data: Organization) => {
    const submitData: Organization = {
      ...data,
      logoUrl: logoUrls ? [logoUrls[0]] : [],
      insightImage: insightUrl ? [insightUrl[0]] : [],
      colorPallet: formData.colorPallet,
      id: defaultValues.id,
    };

    console.log("logo", logoUrls);
    updateOrganizationMutation(submitData);
    resetForm();
  };

  const handleColorChange = (
    index: number,
    field: keyof ColorPallet,
    value: string
  ) => {
    setFormData((prev) => {
      const newColorPallet = [...prev.colorPallet];
      newColorPallet[index] = {
        ...newColorPallet[index],
        [field]: value,
      };
      return {
        ...prev,
        colorPallet: newColorPallet,
      };
    });
  };

  const { mutate: updateOrganizationMutation, isPending } = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      enqueueSnackbar("Organization Updated Successfully!", {
        variant: "success",
      });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar(`Error updating organization: ${error.message}`, {
        variant: "error",
      });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          Edit Organization General Details
        </Typography>
        <IconButton
          onClick={handleClose}
          edge="start"
          sx={{ color: "#024271" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <ImagePreview
              image={logoUrls}
              onRemove={(fileToRemove) => {
                setLogoUrls((prev) =>
                  prev.filter(
                    (file) =>
                      !(
                        (file instanceof File && file === fileToRemove) ||
                        ("gsutil_uri" in file &&
                          file.gsutil_uri ===
                            (fileToRemove as any).gsutil_uri) ||
                        ("fileName" in file &&
                          file.fileName === (fileToRemove as any).fileName)
                      )
                  )
                );
              }}
            />
          </Box>
          <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
            Change Logo Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setLogoUrls([files[0]]);
                }
              }}
            />
          </CustomButton>
        </Stack>

        <Stack m={4} gap={4}>
          <TextField
            required
            id="organizationName"
            label="Organization Name"
            error={!!errors.organizationName}
            helperText={errors.organizationName && "Required"}
            size="small"
            sx={{ flex: 1 }}
            {...register("organizationName", { required: true })}
          />

          <TextField
            required
            id="organizationFactoryName"
            label="Factory Name"
            error={!!errors.organizationFactoryName}
            helperText={errors.organizationFactoryName && "Required"}
            size="small"
            sx={{ flex: 1 }}
            {...register("organizationFactoryName", { required: true })}
          />

          <Box mt={4}>
            {formData.colorPallet.map((palette, index) => (
              <div key={`palette-${index}`}>
                {" "}
                {/* Added proper key */}
                <Typography
                  variant="caption"
                  sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
                >
                  Color Palette
                </Typography>
                <Stack
                  mt={1}
                  gap={6}
                  flexDirection={isMobile ? "column" : "row"}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography>Primary Color</Typography>
                    <ChromePicker
                      color={palette.primaryColor}
                      onChangeComplete={(color) =>
                        handleColorChange(index, "primaryColor", color.hex)
                      }
                      disableAlpha // Optional: if you don't need alpha channel
                    />
                  </Box>

                  <Box>
                    <Typography>Secondary Color</Typography>
                    <ChromePicker
                      color={palette.secondaryColor}
                      onChangeComplete={(color) =>
                        handleColorChange(index, "secondaryColor", color.hex)
                      }
                      disableAlpha
                    />
                  </Box>

                  <Box>
                    <Typography>Button Color</Typography>
                    <ChromePicker
                      color={palette.buttonColor}
                      onChangeComplete={(color) =>
                        handleColorChange(index, "buttonColor", color.hex)
                      }
                      disableAlpha
                    />
                  </Box>
                </Stack>
              </div>
            ))}
          </Box>
        </Stack>
        {/* <TabPanel value={activeTab} index={1} dir={theme.direction}> */}
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <SingleImagePreview
              image={insightUrl}
              onRemove={(fileToRemove) => {
                setInsightUrl((prev) =>
                  prev.filter(
                    (file) =>
                      !(
                        (file instanceof File && file === fileToRemove) ||
                        ("gsutil_uri" in file &&
                          file.gsutil_uri ===
                            (fileToRemove as any).gsutil_uri) ||
                        ("fileName" in file &&
                          file.fileName === (fileToRemove as any).fileName)
                      )
                  )
                );
              }}
            />
          </Box>
          <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
            Change Insight Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setInsightUrl([files[0]]);
                }
              }}
            />
          </CustomButton>
        </Stack>
        <Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              margin: "0.5rem",
            }}
          >
            <Controller
              control={control}
              name={"insightDescription"}
              render={({ field }) => {
                return (
                  <RichTextComponent
                    onChange={(e) => field.onChange(e)}
                    placeholder={field.value ?? "insightDescription"}
                  />
                );
              }}
            />
          </Box>
        </Stack>
        {/* </TabPanel> */}
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "var(--pallet-blue)" }}
          disabled={isPending}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            handleSubmitOrganization(data);
          })}
          disabled={isPending}
          endIcon={
            isPending && <CircularProgress size={20} sx={{ color: "gray" }} />
          }
        >
          Save Changes
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrganizationDialog;
