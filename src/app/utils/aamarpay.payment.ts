import axios from "axios";
import { TPaymentData } from "../modules/payment/payment.interface";
import config from "../config";

// Initiate payment
export const initiatePayment = async (payload: TPaymentData) => {
  try {
    const response = await axios.post(config.aamarpay.post_url, {
      store_id: config.aamarpay.store_id,
      signature_key: config.aamarpay.signature_key,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_phone: payload.phone,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      currency: "BDT",
      amount: payload.amount,
      tran_id: payload.transactionId,
      success_url: `${config.aamarpay.success_url}?transactionId=${payload.transactionId}`,
      fail_url:`${config.aamarpay.fail_url}?transactionId=${payload.transactionId}`,
      cancel_url: `${config.aamarpay.cancel_url}?transactionId=${payload.transactionId}`,
      desc: "Booking Fee",
      type: "json",
    });

  
    return response.data;
  } catch (error: any) {
    console.error("❌ AamarPay initiation error:", error?.response?.data || error.message);
    throw new Error("Payment initiation failed");
  }
};

// Verify payment
export const verifyPaymentWithAmarPay = async (transactionId: string) => {
  try {
    const response = await axios.get(config.aamarpay.verify_url as string, {
      params: {
        store_id: config.aamarpay.store_id,
        signature_key: config.aamarpay.signature_key,
        request_id: transactionId,
        type: "json",
      },
    });

    console.log("✅ AamarPay verify response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ AamarPay verification error:", error?.response?.data || error.message);
    throw new Error("Payment verification failed");
  }
};
