import { Card, CardContent, Typography, Button } from "@mui/material";
import { createOrder } from "../Api/payment";

const DonationCard = ({ title, description, amount }) => {
  const handleDonate = async () => {
    const order = await createOrder(amount);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Donation App",
      order_id: order.id,
      handler: (response) => {
        window.location.href = `/verify-payment?paymentId=${response.razorpay_payment_id}`;
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button variant="contained" onClick={handleDonate}>
          Donate ₹{amount}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
