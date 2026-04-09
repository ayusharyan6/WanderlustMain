import express from "express";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cors from "cors";

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',   
    'http://localhost:8080',
    'http://172.21.2.195:8080',
    'https://jigsaw-pi.vercel.app'
  ],
  credentials: true
}));
 

app.use(express.json());

app.use("/", healthRoutes);
app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookings", bookingRoutes);

export default app;