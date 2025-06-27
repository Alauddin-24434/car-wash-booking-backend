import axios from 'axios';
import dotenv from 'dotenv';
import config from '../../config';
import { TPaymentData } from './payment.interface';



const isSandbox = config.aamarpay_sanbox_mode === "true";
const aamarPayUrl = isSandbox
    ? "https://sandbox.aamarpay.com/jsonpost.php"
    : "https://secure.aamarpay.com/jsonpost.php";

export const initiatePayment = async (payload: TPaymentData) => {
    try {
        const response = await axios.post(`${aamarPayUrl}`, {
            store_id: config.aamarpay_stote_id,
            signature_key: config.aamarpay_signature_key,
            cus_name: payload.name,
            cus_email: payload.email,
            cus_phone: payload.phone,
            cus_add1: "dhaka",
            cus_add2: "Dhaka",
            cus_city: "Dhaka",
            cus_country: "Bangladesh",
            currency: "BDT",
            amount: payload.amount,
            tran_id: payload.transactionId,
            success_url: `${config.aamarpay_sucess_url}?transactionId=${payload.transactionId}`,
            fail_url: `${config.aamarpay_fail_url}`,
            cancel_url: `${config.aamarpay_cancel_url}`,
            desc: "Course Fee",
            type: "json"
        });

        return response.data;
    } catch (error) {
        console.error('AmarPay initiation error:', error);
        throw new Error('Payment initiation failed');
    }
};

const AMARPAY_VERIFY_URL = config.payment_verify_url;

export const verifyPaymentWithAmarPay = async (transactionId: string) => {
    try {
        const response = await axios.get(`${AMARPAY_VERIFY_URL}`, {
            params: {
                store_id: STORE_ID,
                signature_key: SIGNATURE_KEY,
                request_id: transactionId,
                type: 'json',
            },
        });
        console.log(response, "verify response");
        return response.data;
    } catch (error) {
        console.error('AmarPay verification error:', error);
        throw new Error('Payment verification failed');
    }
};
