import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { WasteBin, updateWasteBin } from "../../api/wasteBin";
import ApproveConfirmationModal from "../../components/ApproveConfirmationModal";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import useCurrentUser from "../../hooks/useCurrentUser";
import queryClient from "../../state/queryClient";
import { Payment } from "../../api/payhere";
import { v4 as uuidv4 } from "uuid";
import { Controller, useForm } from "react-hook-form";
import DatePickerComponent from "../../components/DatePickerComponent";
import TimePickerComponent from "../../components/TimePickerComponent";
import { format } from "date-fns";
import { createBinCollectionRequest } from "../../api/binCollectionRequest";
import { useSnackbar } from "notistack";
import { useGeolocation } from "../../hooks/useGeolocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface BinRequestForm {
  collectionDate: Date;
  collectionTime: Date;
}

function ViewRequestBinContent({
  wasteBin,
  isWasteBinDataFetching,
  onClose,
}: {
  wasteBin: WasteBin;
  isWasteBinDataFetching: boolean;
  onClose: () => void;
}) {
  const { isTablet } = useIsMobile();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const { user } = useCurrentUser();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const BIN_REQUEST_PRICE = wasteBin.thresholdLevel * 50;
  const { enqueueSnackbar } = useSnackbar();
  const {
    latitude,
    longitude,
    error: locationError,
    loading: locationLoading,
  } = useGeolocation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BinRequestForm>({});
  const selectedDate = watch("collectionDate");

  useEffect(() => {
    const script = document.createElement("script");
    const PAYHERE_URL = import.meta.env.VITE_PAYHERE_URL;
    script.src = PAYHERE_URL;
    script.async = true;
    document.body.appendChild(script);

    window.payhere = window.payhere || {};
    window.payhere.onCompleted = (orderId: string) =>
      console.log("Payment completed. OrderID:", orderId);
    window.payhere.onDismissed = () => console.log("Payment dismissed");
    window.payhere.onError = (error: string) =>
      console.error("Payment error:", error);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startPayment = async (
    pkg: {
      name: string;
      price: number;
      currency: string;
    },
    data: Payment
  ) => {
    try {
      setLoadingPayment(true);
      if (!latitude || !longitude) {
        enqueueSnackbar(
          "Unable to get your location. Please enable location access.",
          {
            variant: "error",
          }
        );
        setLoadingPayment(false);
        return;
      }
      const orderId = uuidv4();
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const MERCHANT_ID = import.meta.env.VITE_MERCHANT_ID;
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/payhere/hash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: pkg.price.toFixed(2),
          currency: pkg.currency,
        }),
      });
      const { hash } = await response.json();

      const payment = {
        sandbox: true,
        merchant_id: MERCHANT_ID,
        return_url: "http://localhost:3000/payment/success",
        cancel_url: "http://localhost:3000/payment/cancel",
        notify_url: `https://eco-waste-server.vercel.app/api/checkout/payhere-notify-bin`,
        order_id: orderId,
        items: `${pkg.name} Package`,
        amount: pkg.price.toFixed(2),
        currency: pkg.currency,
        hash,
        first_name: data.firstName,
        last_name: data.lastName,
        email: user?.email,
        phone: data.mobile,
        address: data.address,
        city: data.city,
        country: "Sri Lanka",
        custom_1: `${latitude}-${longitude}`,
        custom_2: `${wasteBin._id}-${user._id}`,
      };

      window.payhere.startPayment(payment);
      window.payhere.onCompleted = async function onCompleted() {
        queryClient.invalidateQueries({ queryKey: ["wasteBin"] });
        console.log("Payment completed. OrderID:", payment.order_id);
        setLoadingPayment(false);
        onClose();
      };
    } catch (err) {
      console.error("Error starting payment:", err);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["wasteBin"] });
      setLoadingPayment(false);
      onClose();
    }
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <DrawerContentItem
          label="Reference Number"
          value={wasteBin?.binId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Waste Bin ID"
          value={wasteBin?.binId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Waste Type"
          value={wasteBin?.binType}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Threshold Level (L)"
          value={wasteBin?.thresholdLevel + "L"}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Current Waste Level (%)"
          value={wasteBin?.currentWasteLevel + "%"}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Location"
          value={wasteBin?.location}
          sx={{ flex: 1 }}
        />

        <Box sx={{ margin: "0.5rem", marginTop: "1rem" }}>
          {locationLoading ? (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              Getting your location...
            </Alert>
          ) : locationError ? (
            <Alert severity="error">{locationError}</Alert>
          ) : latitude && longitude ? (
            <Alert severity="success" icon={<LocationOnIcon />}>
              <Typography variant="body2">
                Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Typography>
            </Alert>
          ) : null}
        </Box>

        {wasteBin?.availability ? (
          <Box>
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
                marginTop: "1rem",
                marginX: "0.5rem",
              }}
              size="medium"
              disabled={
                loadingPayment || !latitude || !longitude || locationLoading
              }
              endIcon={
                loadingPayment ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              onClick={() => setApproveDialogOpen(true)}
            >
              Request Bin
            </CustomButton>
            {(!latitude || !longitude) && !locationLoading && (
              <Typography
                variant="caption"
                color="error"
                sx={{
                  marginX: "0.5rem",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                Location access is required to request bin collection
              </Typography>
            )}
          </Box>
        ) : (
          <Alert severity="warning" style={{ marginTop: "1rem" }}>
            This bin is currently unavailable for Request
          </Alert>
        )}
      </Box>

      {approveDialogOpen && (
        <ApproveConfirmationModal
          open={approveDialogOpen}
          title="Request Bin"
          content={
            <>
              Are you sure you want to Request this bin? LKR{" "}
              {BIN_REQUEST_PRICE.toFixed(2)} will be charged to your account.
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setApproveDialogOpen(false)}
          approveFunc={async () => {
            startPayment(
              {
                name: "Bin Collection",
                price: BIN_REQUEST_PRICE,
                currency: "LKR",
              },
              {
                firstName: user?.username || "FirstName",
                lastName: "LastName",
                address: "No 123, Main Street",
                city: "Colombo",
                mobile: user?.mobile || "0771234567",
              }
            );
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )}
    </Stack>
  );
}

export default ViewRequestBinContent;
