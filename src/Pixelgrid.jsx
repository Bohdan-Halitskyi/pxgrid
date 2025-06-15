import React, { useState, useRef } from "react";
import "./styles/Pixelgrid.css";

const PixelGrid = ({ grid, updateColor }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastCellRef = useRef(null);

  const handleMouseDown = (x, y) => {
    setIsDrawing(true);
    updateColor(x, y);
    lastCellRef.current = { x, y };
  };

  const handleMouseMove = (x, y) => {
    if (!isDrawing) return;

    // Avoid updating the same cell multiple times in a row
    if (lastCellRef.current && lastCellRef.current.x === x && lastCellRef.current.y === y) {
      return;
    }

    updateColor(x, y);
    lastCellRef.current = { x, y };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastCellRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    lastCellRef.current = null;
  };

  return (
    <div 
      className="grid"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {grid.map((cell) => (
        <div 
          key={`${cell.x}-${cell.y}`}
          className="gridItem"
          style={{
            backgroundColor: cell.color,
            gridColumnStart: cell.x + 1,
            gridRowStart: cell.y + 1,
          }}
          onMouseDown={() => handleMouseDown(cell.x, cell.y)}
          onMouseMove={() => handleMouseMove(cell.x, cell.y)}
        ></div>
      ))}
    </div>
  );
};

export default PixelGrid;
