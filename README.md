# Car-Wash-Booking-System-mui


Live URL: https://car-wash-booking-system-liard.vercel.app

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

### Prerequisites

- Node.js (version x.x.x)
- MongoDB (if applicable)

### Installation

1. Clone the repository.
<pre>
   https://github.com/Alauddin-24434/Car-Wash-Booking-System.git
</pre>

2. Navigate to the project directory.

<pre>
     cd Car-Wash-Booking-System
</pre>


3.Install dependencies.

<pre>
     npm install
</pre>


4. .env file dependencies.
   <pre>
      NODE_ENV=development
      PORT=5000
      DATABASE_URL=your mongodb url
      BCRYPT_SALT_ROUNDS=12
      DEFAULT_PASS=phuniversity!@#
      ZWT_ACCESS_SECRET=b1bd3f9120550679135e8c284f574e3cc32203aeb393ad8bb306c55a3ff1aaed

   </pre> 

   5. localhost server 5000 run 
      <pre>
         npm run start:dev
      </pre>
