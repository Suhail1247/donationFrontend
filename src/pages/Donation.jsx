import api from "../api/axiosInstance";

const Donations = () => {
  const createOrder = async () => {
    const { data } = await api.post("/payment/create-order", { amount: 100 });
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      name: "Donation App",
      description: "Monthly donation",
      order_id: data.id,
      handler: async (response) => {
        await api.post("/payment/verify-payment", response);
        alert("Payment successful!");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Make a Donation</h1>
      <button onClick={createOrder} className="bg-green-600 text-white px-6 py-3 rounded">
        Donate ₹100
      </button>
    </div>
  );
};

export default Donations;
