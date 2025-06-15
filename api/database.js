import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "grid.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS grid (
  x INT NOT NULL,
  y INT NOT NULL,
  color TEXT NOT NULL
);
`);

const rowCount = db.prepare("SELECT COUNT(*) as count FROM grid").get().count;
if (rowCount === 0) {
  const grid = [];
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      grid.push({ x, y, color: "white" });
    }
  }

  const insert = db.prepare("INSERT INTO grid (x, y, color) VALUES (?, ?, ?)");
  const transaction = db.transaction((grid) => {
    for (const cell of grid) {
      insert.run(cell.x, cell.y, cell.color);
    }
  });

  transaction(grid);
}

export { db };
