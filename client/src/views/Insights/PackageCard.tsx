import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  CardActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import { Payment } from "../../api/payhere";
import useIsMobile from "../../customHooks/useIsMobile";

interface PackageCardProps {
  pkg: { name: string; price: number; currency: string };
  startPayment: (pkg: { name: string; price: number }, data: Payment) => void;
  loadingPackage: string | null;
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  startPayment,
  loadingPackage,
}) => {
  const [expanded, setExpanded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Payment>();

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const isMobile = useIsMobile();
  return (
    <Card
      sx={{
        width: 250,
        textAlign: "center",
        borderRadius: 3,
        boxShadow: 4,
        height: expanded ? "auto" : "fit-content",
        transition: "height 0.3s ease",
      }}
    >
      <form onSubmit={handleSubmit((data) => startPayment(pkg, data))}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {pkg.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={1}>
            {pkg.currency} {pkg.price.toLocaleString()}
          </Typography>

          <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ borderBottom: "1px solid var(--pallet-lighter-grey)" }}
            >
              <Typography variant="subtitle2">Payment Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ flexWrap: "wrap", marginTop: "0.5rem" }}>
                <TextField
                  label="First Name"
                  size="small"
                  {...register("firstName", {
                    required: "First name required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{ flex: 1, margin: "0.5rem" }}
                />
              </Box>
              <Box sx={{ flexWrap: "wrap", marginTop: "0.5rem" }}>
                <TextField
                  label="Last Name"
                  size="small"
                  {...register("lastName", { required: "Last name required" })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{ flex: 1, margin: "0.5rem" }}
                />
              </Box>
              <Box sx={{ flexWrap: "wrap", marginTop: "0.5rem" }}>
                <TextField
                  label="Mobile Number"
                  size="small"
                  type="number"
                  {...register("mobile", {
                    required: "Mobile number required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10-digit mobile number",
                    },
                  })}
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                  sx={{ flex: 1, margin: "0.5rem" }}
                />
              </Box>
              <Box sx={{ flexWrap: "wrap", marginTop: "0.5rem" }}>
                <TextField
                  label="Address"
                  size="small"
                  {...register("address", { required: "Address required" })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  sx={{ flex: 1, margin: "0.5rem" }}
                />
              </Box>
              <Box sx={{ flexWrap: "wrap", marginTop: "0.5rem" }}>
                <TextField
                  label="City"
                  size="small"
                  {...register("city", { required: "City required" })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  sx={{ flex: 1, margin: "0.5rem" }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <CustomButton
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "var(--eco-waste-blue)" }}
            size="medium"
          >
            {loadingPackage === pkg.name ? "processing..." : "Pay Now"}
          </CustomButton>
        </CardActions>
      </form>
    </Card>
  );
};

export default PackageCard;
