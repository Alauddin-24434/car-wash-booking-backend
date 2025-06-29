export const generatePaymentHtml = (status: "success" | "failed" | "cancelled", transactionId?: string) => {
  let title = "", message = "", color = "";

  switch (status) {
    case "success":
      title = "🎉 Payment Successful";
      message = `Your transaction${transactionId ? ` (ID: ${transactionId})` : ""} was completed successfully.`;
      color = "green";
      break;
    case "failed":
      title = "❌ Payment Failed";
      message = "Unfortunately, your payment could not be processed.";
      color = "red";
      break;
    case "cancelled":
      title = "⚠️ Payment Cancelled";
      message = "Your payment was cancelled. Please try again if this was unintentional.";
      color = "orange";
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 40px;
          border: 2px solid ${color};
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
          color: ${color};
        }
        p {
          font-size: 18px;
          color: #333;
        }
        a.button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: ${color};
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        a.button:hover {
          background-color: dark${color};
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${message}</p>
        <a class="button" href="https://car-wash-booking-seven.vercel.app">⬅️ Back to Home</a>
      </div>
    </body>
    </html>
  `;
};
