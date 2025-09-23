import express from "express";
import bodyParser from "body-parser";
import dkimRoutes from "./routes/dkimRoutes.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(bodyParser.json());

app.use(cors({
  origin: "https://dkim-key-automation-iz31-git-main-pss-projects-7ffb7410.vercel.app" 
  // origin: "http://localhost:5173" 
}));

// routes
app.use("/api/dkim", dkimRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
