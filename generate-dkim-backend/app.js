import express from "express";
import bodyParser from "body-parser";
import dkimRoutes from "./routes/dkimRoutes.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173" 
}));

// Routes
app.use("/api/dkim", dkimRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
