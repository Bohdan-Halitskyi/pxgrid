import React, { useEffect, useState } from "react";
import "./styles/App.css";
import PixelGrid from "./Pixelgrid.jsx";
import Toolbar from "./Toolbar.jsx";

const URL = import.meta.env.VITE_API_URL || "/api";

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/grid`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.grid) {
          setGrid(data.grid);
        } else {
          console.error("Invalid grid data format:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching grid data:", error);
        setLoading(false);
      });
  }, []);

    const updateColor = async (x, y) => {
        // Update the grid locally first for immediate feedback
        setGrid(prevGrid => {
            return prevGrid.map(cell => {
                if (cell.x === x && cell.y === y) {
                    return { ...cell, color: selectedColor };
                }
                return cell;
            });
        });

        try {
            const response = await fetch(`${URL}/setGridColor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ x, y, color: selectedColor }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }


        } catch (error) {
            console.error("Error updating grid color:", error);
        }
    }

  return (
    <div className="content-wrapper">
      <h1>Pixel Grid</h1>
      {loading ? (
        <div className="loading">Loading grid data...</div>
      ) : (
        <>
          <PixelGrid grid={grid} updateColor={updateColor}/>
          <Toolbar 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor}
          />
        </>
      )}
    </div>
  );
};

export default App;
