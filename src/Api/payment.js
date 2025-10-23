import axios from "axios";

// Set base URL
axios.defaults.baseURL = "http://localhost:8000";

export const handleRazorpayPayment = async () => {
  console.log("🔔 handleRazorpayPayment triggered");

  try {
    if (typeof window.Razorpay === "undefined") {
      console.error("❌ Razorpay SDK not loaded");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in");
      return;
    }

    // Step 1: Create order from backend
    const { data } = await axios.post(
      "/api/payment/create-order",
      { amount: 100 },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const order = data.order;
    console.log("✅ Order created:", order);

    // Step 2: Configure Razorpay options
    const options = {
      key: "rzp_test_RUabNZhCufN59v", // Replace with your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "Test App",
      description: "Monthly Donation",
      order_id: order.id,
      handler: async function (response) {
        console.log("✅ Payment response:", response);

        // Step 3: Verify payment on backend
        try {
          const verifyRes = await axios.post(
            "/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              mode: "card",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("✅ Payment verified:", verifyRes.data);
          alert("Donation Successful!");
          window.location.reload();
        } catch (err) {
          console.error("❌ Payment verification failed:", err);
          alert("Payment verification failed.");
        }
      },
      theme: {
        color: "#ebc191",
      },
    };

    const razorpay = new window.Razorpay(options);

    // Optional: Log failed payments
    razorpay.on("payment.failed", function (response) {
      console.error("❌ Payment failed:", response.error);
      alert("Payment failed: " + response.error.description);
    });

    // Step 4: Open Razorpay modal
    razorpay.open();

  } catch (error) {
    console.error("❌ Payment Error:", error.message || error);
    alert("Something went wrong during payment.");
  }
};
