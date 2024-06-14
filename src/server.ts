import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";


async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connection successful");
    app.listen(config.port, ()=>{
        console.log(`App is listening on port ${config.port}`);
    });
  } catch (err:any) {
    if (err.message.includes('querySrv')) {
        console.log('Error: Unable to connect to the database. Please check your internet connection.');
      } else {
        console.log('An unexpected error occurred:', err.message || err);
      }
  }
}

main()