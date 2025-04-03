import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";

// Inscrir un nouveau utilisateur d'application


export const userRegister = async (req: Request, res: Response): Promise<void> => {
  console.log("User registration attempt");

  try {
    const { nom, prenom, email } = req.body;

    if (!email || !nom || !prenom) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the email already exists
    const existingUser: any[] = await sequelize.query(
      "SELECT * FROM Utilisateur WHERE email = :email",
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (existingUser.length > 0) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    // Insert the user
    await sequelize.query(
      "INSERT INTO Utilisateur (nom, prenom, email) VALUES (:nom, :prenom, :email)",
      {
        replacements: { nom, prenom, email },
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error registering user", details: (err as Error).message });
  }
};


export const userLogin = async (req: Request, res: Response): Promise<void> => {

  console.log("Request body:", req.body);
  try {
    const { email } = req.body;
    console.log("Extracted email:", typeof email);
    

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if the email exists
    const user = await sequelize.query(
      "SELECT * FROM Utilisateur WHERE email = :email",
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (user.length === 0) {
      res.status(404).json({ message: "User not found. Please register." });
      return;
    }

    // Successfully logged in
    res.status(200).json({ message: "Login successful", user: user[0] });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error", details: (err as Error).message });
  }
};

export const getUserMovies = async (req: Request, res: Response): Promise<void> => {
  try {

    const { id } = req.params
    console.log("User ID received:", id);
    console.log(id);
    
    if (!id) {
       res.status(400).json({ error: "User ID is required" });
       return;
    }

    const catalogue = await sequelize.query(
      `SELECT f.id_film, f.titre, f.img_url, i.type_interaction as mode
      FROM Utilisateur u
      JOIN Interaction i
      on i.id_utilisateur = u.id_utilisateur
      JOIN Film f
      on f.id_film = i.id_film
      WHERE u.id_utilisateur = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    res.status(200).json({ message: "La collection d'utilisateur est retrouvé", catalogue: catalogue });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error", details: (err as Error).message });

  }
}


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
