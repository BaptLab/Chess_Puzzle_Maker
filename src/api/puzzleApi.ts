// src/api/puzzleApi.ts

import { Puzzle } from "../interfaces/Puzzle";

const API_URL = "http://localhost:8080/api/puzzles"; // Ensure the correct URL

export const fetchPuzzles = async (
  theme: string | undefined,
  minRating: number | undefined,
  maxRating: number | undefined,
  count: number | undefined
): Promise<Puzzle[]> => {
  try {
    const response = await fetch(
      `${API_URL}?count=${count}&theme=${theme}&minRating=${minRating}&maxRating=${maxRating}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch puzzles");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
