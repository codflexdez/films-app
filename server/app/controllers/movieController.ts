import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";

// Get all movies
export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await sequelize.query("SELECT * FROM Film", {
      type: QueryTypes.SELECT,
    });
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};