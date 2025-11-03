import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export const handleRazorpayPayment = async (month) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      "/api/payment/create-order",
      { amount: 100 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = data.order;

    const options = {
      key: "rzp_test_RUabNZhCufN59v",
      amount: order.amount,
      currency: "INR",
      name: "Donation",
      order_id: order.id,

      handler: async function (response) {
        await axios.post(
          "/api/payment/verify-payment",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            mode: "online",
            month,    
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Payment Successful!");
        window.location.reload();
      },

      theme: { color: "#ebc191" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error("Payment error:", err);
  }
};
