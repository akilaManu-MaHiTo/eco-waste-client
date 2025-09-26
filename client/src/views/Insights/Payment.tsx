import React, { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import PackageCard from "./PackageCard";
import { Payment } from "../../api/payhere";
import useCurrentUser from "../../hooks/useCurrentUser";
import queryClient from "../../state/queryClient";
import useIsMobile from "../../customHooks/useIsMobile";

declare global {
  interface Window {
    payhere: any;
  }
}

const PayHereCheckout: React.FC = () => {
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const { user } = useCurrentUser();
  const { isMobile } = useIsMobile();

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
    pkg: { name: string; price: number; currency: string },
    data: Payment
  ) => {
    try {
      setLoadingPackage(pkg.name);
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
        notify_url: `${BASE_URL}/api/checkout/payhere-notify`,
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
        custom_1: user?._id,
      };

      window.payhere.startPayment(payment);
      window.payhere.onCompleted = function onCompleted() {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        console.log("Payment completed. OrderID:", payment.order_id);
        setLoadingPackage(null);
      };
    } catch (err) {
      console.error("Error starting payment:", err);
    } finally {
      setLoadingPackage(null);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }
  };

  const packages = [
    { name: "Gold", price: 100, currency: "LKR" },
    { name: "Platinum", price: 200, currency: "LKR" },
    { name: "Diamond", price: 300, currency: "LKR" },
  ];

  return (
    <Stack spacing={4} alignItems="center" mt={6}>
      <Typography variant="h4" fontWeight="bold">
        Choose Your Package
      </Typography>

      <Stack direction={isMobile ? "column" : "row"} spacing={4}>
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.name}
            pkg={pkg}
            startPayment={startPayment}
            loadingPackage={loadingPackage}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PayHereCheckout;
