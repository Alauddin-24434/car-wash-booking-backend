# Car-Wash-Booking-System-mui




# Key Features:
User Registration and Login:

Existing users can login with their password, email.

Users can select their preferred date, time, and type of car wash service.
Bookings are saved in the database for easy management.
Service Management:

Admins can add, update, or remove services.
Admins can view all bookings and manage them efficiently.
Users can update their personal information and manage their profile.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Typescrit
- zod
- jsonwetoken

## Installation and Setup

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
SUCCESS_URL=http://localhost/api/verify-payment
FAIL_URL=http://localhost/api/payment/fail
CANCEL_URL=http://localhost/api/payment/cancel
```

> **Note:** Replace the values with your actual credentials before running the project.

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Alauddin-24434/royal-place-backend.git
cd royal-place-backend
```

### 2. Install Dependencies

This project uses [pnpm](https://pnpm.io/) (recommended), but you can use npm if needed.

#### Using pnpm (recommended):

```bash
pnpm install
```

#### Using npm:

1. **Delete the pnpm lockfile first:**
    ```bash
    rm -rf pnpm-lock.yaml
    ```
2. **Then install dependencies:**
    ```bash
    npm install
    ```

> **Warning:** Do **not** mix pnpm and npm in the same project.

---

## 🚀 Running the Project

### Development

```bash
pnpm run dev
# or
npm run dev
```

### Production

```bash
pnpm run build && pnpm start
# or
npm run build && npm start
```


---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## 📫 Contact

For questions or support, please contact [alauddin150900@gmail.com].