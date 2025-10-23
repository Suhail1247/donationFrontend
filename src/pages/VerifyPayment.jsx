import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyPayment } from "../Api/payment";
import { Container, Typography } from "@mui/material";

const VerifyPayment = () => {
  const [params] = useSearchParams();
  const paymentId = params.get("paymentId");

  useEffect(() => {
    if (paymentId) verifyPayment({ paymentId });
  }, [paymentId]);

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h5">Verifying your payment...</Typography>
    </Container>
  );
};

export default VerifyPayment;
