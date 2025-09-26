import { Avatar, Badge, Box, Button, Stack, Typography } from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useIsMobile from "../../customHooks/useIsMobile";
import { User } from "../../api/userApi";
import { useState } from "react";
import MultiDrawerContent from "../../components/MultiDrawerContent";
import ProfileImage from "../../components/ProfileImageComponent";

function ViewUserContent({ selectedUser }: { selectedUser: User }) {
  const { isTablet, isMobile } = useIsMobile();
  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <Stack
      sx={{
        display: "flex",
        marginY: 1,
        flexDirection: isTablet ? "column" : "row",
        p: "1rem",
      }}
      gap={4}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: "1rem",
          boxShadow: 3,
        }}
        gap={2}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.5rem",
            color: "var(--pallet-dark-blue)",
            marginTop: 2,
          }}
        >
          {selectedUser?.username}
        </Typography>

        <ProfileImage
          name={selectedUser?.username}
          files={imageFile ? [imageFile] : selectedUser?.profileImage}
          fontSize="5rem"
        />
      </Box>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: 2,
          boxShadow: 3,
          p: "3rem",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            flex: 1,
          }}
        >
          <DrawerContentItem
            label="Employee Id"
            value={selectedUser?._id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Email"
            value={selectedUser?.email}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            flex: 1,
          }}
        >
          <DrawerContentItem
            label="Full Name"
            value={selectedUser?.username}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Mobile Number"
            value={selectedUser?.mobile}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            flex: 1,
          }}
        >
          <DrawerContentItem
            label="User Type"
            value={selectedUser?.userType?.userType}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            flex: 1,
          }}
        ></Stack>
      </Stack>
    </Stack>
  );
}

export default ViewUserContent;
