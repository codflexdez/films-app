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
// query params -> /actors/:nom/:prenom
export const getAllActors = async (req: Request, res: Response) => {
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


export const getMoviesGenres = async (req: Request, res: Response) => {
  try {
    
    // Perform the query with the provided parameters
    const films = await sequelize.query(
      `SELECT 
        f.titre, 
        STRING_AGG(g.nom_genre, ', ') AS genres
      FROM Film f
      JOIN Appartenir a ON f.id_film = a.id_film
      JOIN Genre g ON a.id_genre = g.id_genre
      GROUP BY f.id_film, f.titre
      HAVING COUNT(a.id_genre) > 1`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Check if actors were found
    if (films.length > 0) {
      res.status(200).json(films); // Return the list of films
    } else {
      res.status(404).json({ message: "Aucun film trouvé avec plus d'un genre" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produit lors de fetch" });
  }
};







