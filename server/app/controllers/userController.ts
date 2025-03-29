import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";

// Inscrir un nouveau utilisateur d'application
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, nom, prenom } = req.body;

    if (!email || !nom || !prenom) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Raw SQL query to insert the user
    const result = await sequelize.query(
      "INSERT INTO Utilisateur (email, nom, prenom) VALUES (:email, :nom, :prenom)",
      {
        replacements: { email, nom, prenom },
        type: QueryTypes.INSERT, // Indicates it's an INSERT query
      }
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user", details: err });
  }
};

// Get all users with a raw SQL query
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Raw SQL query to get all users
    const users = await sequelize.query("SELECT * FROM Utilisateur", {
      type: QueryTypes.SELECT, // Indicates it's a SELECT query
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users", details: err });
  }
};
