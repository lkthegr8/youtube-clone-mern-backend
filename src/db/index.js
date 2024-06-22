import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {}
    );
    console.log(`\n MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // process exit happen even when we throw an error, but we will exit it manually with process.exit
    // process is a built-in nodejs module
    // there are many process.exit() methods. like process.exit(0), process.exit(1), process.exit(2)
    // The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code.
    // The shell that executed Node.js should see the exit code as 1.
    // Calling process.exit() will force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully, including I/O operations to process.stdout and process.stderr.
    // In most situations, it is not actually necessary to call process.exit() explicitly. The Node.js process will exit on its own if there is no additional work pending in the event loop. The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.
    process.exit(1);
  }
};

export default connectDB;
