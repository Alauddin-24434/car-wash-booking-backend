"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentWithAmarPay = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../../config"));
dotenv_1.default.config();
const AMARPAY_URL = config_1.default.payment_url;
const STORE_ID = config_1.default.stote_id;
const SIGNATURE_KEY = config_1.default.signature_key;
const initiatePayment = (transactionId, name, email, phone, address, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${AMARPAY_URL}/jsonpost.php`, {
            store_id: STORE_ID,
            signature_key: SIGNATURE_KEY,
            cus_name: name,
            cus_email: email,
            cus_phone: phone,
            cus_add1: address,
            cus_add2: "Dhaka",
            cus_city: "Dhaka",
            cus_country: "Bangladesh",
            currency: "BDT",
            amount,
            tran_id: transactionId,
            success_url: `https://car-wash-booking-system-liard.vercel.app/api/verify-payment?transactionId=${transactionId}`,
            fail_url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf6Z7CgLJ3JfLy4IREsARVyxcBnQQnHN40jw&s`,
            cancel_url: `https://static.vecteezy.com/system/resources/previews/019/797/644/non_2x/failed-rubber-stamp-with-grunge-style-on-white-background-vector.jpg`,
            desc: "Course Fee",
            type: "json"
        });
        return response.data;
    }
    catch (error) {
        console.error('AmarPay initiation error:', error);
        throw new Error('Payment initiation failed');
    }
});
exports.initiatePayment = initiatePayment;
const AMARPAY_VERIFY_URL = config_1.default.payment_verify_url;
const verifyPaymentWithAmarPay = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${AMARPAY_VERIFY_URL}`, {
            params: {
                store_id: STORE_ID,
                signature_key: SIGNATURE_KEY,
                request_id: transactionId,
                type: 'json',
            },
        });
        console.log(response, "verify response");
        return response.data;
    }
    catch (error) {
        console.error('AmarPay verification error:', error);
        throw new Error('Payment verification failed');
    }
});
exports.verifyPaymentWithAmarPay = verifyPaymentWithAmarPay;
