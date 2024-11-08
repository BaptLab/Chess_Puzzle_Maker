import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import html2canvas from "html2canvas"; // Import html2canvas for capturing DOM elements
import { Puzzle } from "@/interfaces/Puzzle"; // Import Puzzle interface for type checking
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs"; // Import Chessboard.js directly

export const generatePuzzlesPdf = async (
  puzzles: Puzzle[]
) => {
  const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF document in portrait mode
  const maxProblemsPerPage = 6; // Maximum number of puzzles per page

  // Define margin variables
  const topMargin = 50; // Increased top margin for the first page
  const sideMargin = 10; // Side margin for all pages
  const puzzleWidth = 90; // Width for each puzzle image
  const puzzleHeight = (puzzleWidth * 160) / 190; // Maintain aspect ratio based on previous width calculation
  const verticalSpacing = 20; // Vertical space between puzzles
  const horizontalSpacing = 20; // Horizontal space between puzzles

  // Loop through each puzzle
  for (let i = 0; i < puzzles.length; i++) {
    const puzzle = puzzles[i]; // Get the current puzzle

    // Create a container for the chessboard and FEN display
    const container = document.createElement("div");
    container.style.display = "flex"; // Use flexbox for layout
    container.style.flexDirection = "column"; // Stack elements vertically
    container.style.alignItems = "center"; // Center align items
    container.style.marginBottom = "20px"; // Space between puzzles

    // Create a chessboard element and set its ID
    const chessboardElement = document.createElement("div");
    chessboardElement.id = `chessboard-${i}`; // Unique ID for the chessboard
    chessboardElement.style.width = `${puzzleWidth}px`; // Set width for the chessboard
    chessboardElement.style.height = `${puzzleHeight}px`; // Set height for the chessboard
    container.appendChild(chessboardElement); // Append chessboard to container

    // Create a paragraph to display the themes ,
    const themesParagraph = document.createElement("span");
    themesParagraph.textContent = `Themes: ${puzzle.themes}`; // Display the puzzle themes
    container.appendChild(themesParagraph); // Append themes paragraph to container

    // Append the container to the document body (invisible)
    document.body.appendChild(container);

    // Initialize the chessboard using Chessboard2
    const chessboard = Chessboard2(chessboardElement.id, {
      draggable: false, // Disable dragging
      dropOffBoard: "trash", // Pieces dropped off board are removed
      sparePieces: true, // Allow spare pieces
    });
    chessboard.setPosition(puzzle.fen); // Set the board to the FEN position

    // Wait a brief moment to ensure the chessboard renders with pieces
    await new Promise((resolve) =>
      setTimeout(resolve, 100)
    ); // Increase delay to ensure rendering

    // Wait for the chessboard to render before capturing it
    await html2canvas(container, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Get image data

      // Calculate the X and Y positions based on the grid layout
      const row = Math.floor(i / 2); // 2 columns
      const col = i % 2; // 2 columns

      // Define the position in the PDF
      const x =
        sideMargin +
        col * (puzzleWidth + horizontalSpacing); // Calculate X position
      const y =
        topMargin + row * (puzzleHeight + verticalSpacing); // Calculate Y position

      // Add the image to the PDF
      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        puzzleWidth,
        puzzleHeight
      ); // Add the image to the PDF
    });

    // Clean up: clear the chessboard and remove the container from the document
    chessboard.clear(); // Clear the chessboard
    document.body.removeChild(container); // Remove the container after processing

    // Add a new page after every 6 problems
    if (
      (i + 1) % maxProblemsPerPage === 0 &&
      i !== puzzles.length - 1
    ) {
      pdf.addPage(); // Add a new page to the PDF
    }
  }

  // Save the generated PDF with a filename
  pdf.save("puzzles.pdf"); // Save the PDF
};
