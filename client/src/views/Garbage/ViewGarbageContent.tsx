import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { Garbage } from "../../api/garbage";
import ApproveConfirmationModal from "../../components/ApproveConfirmationModal";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import useCurrentUser from "../../hooks/useCurrentUser";
import queryClient from "../../state/queryClient";
import { Payment } from "../../api/payhere";
import { v4 as uuidv4 } from "uuid";
import { Controller, useForm } from "react-hook-form";
import DatePickerComponent from "../../components/DatePickerComponent";
import { GarbageRequest } from "../../api/garbageRequestApi";
import TimePickerComponent from "../../components/TimePickerComponent";
import { useSnackbar } from "notistack";

function ViewGarbageContent({
  garbage,
  isGarbageDataFetching,
  onClose,
}: {
  garbage: Garbage;
  isGarbageDataFetching: boolean;
  onClose: () => void;
}) {
  const { isTablet } = useIsMobile();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const { user } = useCurrentUser();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const GARBAGE_REQUEST_PRICE = 100 * garbage.wasteWeight;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GarbageRequest>({});
  const selectedDate = watch("collectionDate");

  const handlePaymentSuccess = useCallback(
    (orderId?: string) => {
      enqueueSnackbar("Payment successful!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["garbage"] });
      console.log("Payment completed. OrderID:", orderId);
      setLoadingPayment(false);
      onClose();
    },
    [enqueueSnackbar, onClose]
  );

  useEffect(() => {
    const script = document.createElement("script");
    const PAYHERE_URL = import.meta.env.VITE_PAYHERE_URL;
    script.src = PAYHERE_URL;
    script.async = true;
    document.body.appendChild(script);

    window.payhere = window.payhere || {};
    window.payhere.onCompleted = handlePaymentSuccess;
    window.payhere.onDismissed = () => console.log("Payment dismissed");
    window.payhere.onError = (error: string) =>
      console.error("Payment error:", error);

    return () => {
      document.body.removeChild(script);
    };
  }, [handlePaymentSuccess]);
  const startPayment = async (
    pkg: {
      name: string;
      price: number;
      currency: string;
      custom_1?: string;
    },
    data: Payment
  ) => {
    try {
      setLoadingPayment(true);
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
        notify_url: `https://eco-waste-server.vercel.app/api/checkout/payhere-notify`,
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
        custom_1: pkg.custom_1,
        custom_2: garbage._id,
      };

      window.payhere.startPayment(payment);
      window.payhere.onCompleted = () => handlePaymentSuccess(payment.order_id);
    } catch (err) {
      console.error("Error starting payment:", err);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["garbage"] });
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
          value={garbage?._id}
          sx={{ flex: 1 }}
        />
        {/* <DrawerContentItem
          label="Requested Date"
          value={
            medicalRequest.created_at
              ? format(medicalRequest.created_at, "dd/MM/yyyy hh:mm a")
              : "--"
          }
          sx={{ flex: 1 }}
        /> */}
        <DrawerContentItem
          label="Garbage Bin ID"
          value={garbage?.binId?.binId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Garbage Category"
          value={garbage?.garbageCategory}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Garbage Weight"
          value={garbage?.wasteWeight + "kg"}
          sx={{ flex: 1 }}
        />
        {garbage?.status.toLowerCase() === "pending" && (
          <>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                {...register("collectionDate", { required: true })}
                name={"collectionDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : undefined}
                      label="Collection Date"
                      error={errors?.collectionDate ? "Required" : ""}
                      disablePast={true}
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                {...register("collectionTime", { required: true })}
                name={"collectionTime"}
                render={({ field }) => {
                  return (
                    <TimePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      date={selectedDate ? new Date(selectedDate) : undefined}
                      label="Collection Time"
                      error={errors?.collectionTime ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
          </>
        )}

        {garbage?.status.toLowerCase() === "pending" ? (
          <Box>
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
                marginTop: "1rem",
                marginX: "0.5rem",
              }}
              size="medium"
              disabled={isGarbageDataFetching}
              endIcon={
                loadingPayment ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              onClick={() => setApproveDialogOpen(true)}
            >
              Request Garbage Collection
            </CustomButton>
          </Box>
        ) : (
          <Alert severity="info" style={{ marginTop: "1rem" }}>
            This garbage collection request is already{" "}
            {garbage?.status.toLowerCase()}.
          </Alert>
        )}
      </Box>

      {approveDialogOpen && (
        <ApproveConfirmationModal
          open={approveDialogOpen}
          title="Request Garbage Collection"
          content={
            <>
              Are you sure you want to Request this garbage collection? LKR{" "}
              {GARBAGE_REQUEST_PRICE.toFixed(2)} will be charged to your
              account.
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setApproveDialogOpen(false)}
          approveFunc={async () => {
            const collectionDate = watch("collectionDate");
            const collectionTime = watch("collectionTime");

            const formattedDate = collectionDate
              ? format(new Date(collectionDate), "yyyy-MM-dd")
              : "";
            const formattedTime = collectionTime
              ? format(new Date(collectionTime), "HH:mm")
              : "";
            const combinedDateTime = `${formattedDate} ${formattedTime}`;
            startPayment(
              {
                name: "Garbage Collection",
                price: GARBAGE_REQUEST_PRICE,
                currency: "LKR",
                custom_1: combinedDateTime,
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

export default ViewGarbageContent;
