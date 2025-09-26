import { Box, Stack, Typography } from "@mui/material";
import welcome from "../../assets/welcomeInsight.png";
import useCurrentUser from "../../hooks/useCurrentUser";
// import { getOrganization } from "../../api/OrganizationSettings/organizationSettingsApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import insightImage from "../../assets/welcomeInsight.png";
function Insight() {
  const { user } = useCurrentUser();

  // const { data: organizationData } = useQuery({
  //   queryKey: ["organization"],
  //   queryFn: getOrganization,
  // });

  // console.log("yoo", organizationData?.insightImage);
  // const insightImage = useMemo(() => {
  //   if (organizationData && organizationData?.insightImage) {
  //     return Array.isArray(organizationData.insightImage)
  //       ? organizationData.insightImage[0]
  //       : organizationData.insightImage;
  //   }
  // }, [organizationData]);

  // const insightDescription = useMemo(() => {
  //   if (organizationData && organizationData?.insightDescription) {
  //     return Array.isArray(organizationData.insightDescription)
  //       ? organizationData.insightDescription[0]
  //       : organizationData.insightDescription;
  //   }
  // }, [organizationData]);

  return (
    <Stack>
      <Typography
        variant="h3"
        align="center"
        sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "var(--eco-waste-primary-green)" }}
      >
        {`Welcome ${user?.username}!`}
      </Typography>
      <Box
        component="img"
        src={insightImage}
        alt="Under Development"
        sx={{
          height: "auto",
          width: "60vw",
          maxHeight: "50vh",
          objectFit: "contain",
          justifySelf: "center",
          alignSelf: "center",
        }}
      />
      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 2, color: "var(--pallet-main-blue)" }}
      >
        View real-time insights on waste generation, collection efficiency, and trends.
      </Typography>
    </Stack>
  );
}

export default Insight;
