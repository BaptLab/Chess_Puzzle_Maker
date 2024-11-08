"use client"; // Add this line at the top

import { fetchPuzzles } from "@/api/puzzleApi"; // Ensure the import path is correct
import { useState } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import Image from "next/image";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";

const Home = () => {
  // State variables with type annotations
  const [theme, setTheme] = useState<string>("");
  const [minRating, setMinRating] = useState<
    number | undefined
  >(undefined);
  const [maxRating, setMaxRating] = useState<
    number | undefined
  >(undefined);
  const [count, setCount] = useState<number>(5); // Default count
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]); // State to hold puzzles with images
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  console.log("puzzles:", puzzles);
  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when fetching data

    const data = await fetchPuzzles(
      theme,
      minRating,
      maxRating,
      count
    ); // Fetch puzzles directly
    console.log("Fetched puzzles:", data); // Log fetched puzzles
    setPuzzles(data); // Update puzzles state with fetched data
    setLoading(false); // Set loading to false after data is fetched
  };

  // Handle PDF generation
  const handleGeneratePdf = () => {
    if (puzzles.length > 0) {
      generatePuzzlesPdf(puzzles); // Call the generatePdf function with the puzzles
    } else {
      alert("No puzzles to generate PDF.");
    }
  };

  return (
    <div>
      <h1>PuzzleCraft</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Theme:
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        <br />
        <label>
          Min Rating:
          <input
            type="number"
            value={minRating || ""} // Handle undefined case
            onChange={(e) =>
              setMinRating(
                e.target.value
                  ? parseInt(e.target.value)
                  : undefined
              )
            }
          />
        </label>
        <br />
        <label>
          Max Rating:
          <input
            type="number"
            value={maxRating || ""} // Handle undefined case
            onChange={(e) =>
              setMaxRating(
                e.target.value
                  ? parseInt(e.target.value)
                  : undefined
              )
            }
          />
        </label>
        <br />
        <label>
          Count:
          <input
            type="number"
            value={count}
            onChange={(e) =>
              setCount(parseInt(e.target.value))
            }
          />
        </label>
        <br />
        <button type="submit">Get Puzzles</button>
      </form>

      {/* Display loading status */}
      {loading && <p>Loading...</p>}

      {/* Render ChessboardComponents for each puzzle */}
      {/* Render ChessboardComponents for each puzzle */}
      <div>
        {puzzles.map((puzzle) => (
          <div
            key={puzzle.puzzleId}
            style={{ marginBottom: "20px" }}
          >
            <ChessboardComponent
              fen={puzzle.fen}
              id={`board-${puzzle.puzzleId}`}
            />{" "}
          </div>
        ))}
      </div>
      <button onClick={handleGeneratePdf}>
        Generate PDF
      </button>
    </div>
  );
};

export default Home;
