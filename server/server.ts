import express from "express";
import cors from "cors";
import sequelize from "./app/config/db"; // Ensure correct path to db.ts
import { getAllMovies } from "./app/controllers/movieController";
import { getUsers } from "./app/controllers/userController";


const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.get("/movies", getAllMovies);
app.get("/users", getUsers);

const PORT = process.env.PORT ?? 5000;
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
