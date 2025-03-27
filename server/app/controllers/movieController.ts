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

//« Donne-moi tous les noms de films avec la participation de l'acteur Tom Hanks. »

const getAllActors = async (req: Request, res: Response) => {
  try {
    // Extract the 'nom' and 'prenom' from request parameters
    const { nom, prenom } = req.params;

    // Perform the query with the provided parameters
    const actors = await sequelize.query(
      `SELECT f.titre
      FROM Film f
      JOIN Participer p ON f.id_film = p.id_film
      JOIN Membre m ON p.id_membre = m.id_membre
      WHERE m.nom = :nom AND m.prenom = :prenom`,
      {
        type: QueryTypes.SELECT,
        replacements: { nom, prenom }, // Prevent SQL injection
      }
    );

    // Check if actors were found
    if (actors.length > 0) {
      res.status(200).json(actors); // Return the list of films
    } else {
      res.status(404).json({ message: 'No films found for this actor' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the films' });
  }
};





