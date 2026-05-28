import { useMemo, useState } from "react";

function GridEditor() {
  const rows = 100;
  const cols = 100;

  // grid
  const [grid, setGrid] = useState(
    Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            type: null,
          }))
      )
  );

  // zoom
  const [cellSize, setCellSize] =
    useState(24);

  // drawing
  const [isMouseDown, setIsMouseDown] =
    useState(false);

  // selected tool
  const [selectedTool, setSelectedTool] =
    useState("wall");

  // excel column labels
  const columnLabels = useMemo(() => {
    return Array(cols)
      .fill(null)
      .map((_, i) => {
        let result = "";
        let num = i;

        while (num >= 0) {
          result =
            String.fromCharCode((num % 26) + 65) +
            result;

          num = Math.floor(num / 26) - 1;
        }

        return result;
      });
  }, []);

  // paint
  function paintCell(row, col) {
    setGrid((prev) => {
      const newGrid = [...prev];

      newGrid[row] = [...newGrid[row]];

      newGrid[row][col] = {
        type:
          selectedTool === "erase"
            ? null
            : selectedTool,
      };

      return newGrid;
    });
  }

  // drag paint
  function handleMouseEnter(row, col) {
    if (!isMouseDown) return;

    setGrid((prev) => {
      const newGrid = [...prev];

      newGrid[row] = [...newGrid[row]];

      newGrid[row][col] = {
        type:
          selectedTool === "erase"
            ? null
            : selectedTool,
      };

      return newGrid;
    });
  }

  // zoom with ctrl + wheel
  function handleWheel(e) {
    if (!e.ctrlKey) return;

    e.preventDefault();

    if (e.deltaY < 0) {
      setCellSize((prev) =>
        Math.min(prev + 2, 50)
      );
    } else {
      setCellSize((prev) =>
        Math.max(prev - 2, 10)
      );
    }
  }

  // clear
  function clearGrid() {
    setGrid(
      Array(rows)
        .fill(null)
        .map(() =>
          Array(cols)
            .fill(null)
            .map(() => ({
              type: null,
            }))
        )
    );
  }

  return (
    <div className="edit-card">
      <h2>Chỉnh sửa nhà</h2>

      <div className="editor-layout">
        {/* GRID */}
        <div
          className="grid-wrapper"
          onWheel={handleWheel}
          onMouseDown={() =>
            setIsMouseDown(true)
          }
          onMouseUp={() =>
            setIsMouseDown(false)
          }
          onMouseLeave={() =>
            setIsMouseDown(false)
          }
        >
          <div
            className="excel-grid"
            style={{
              gridTemplateColumns: `60px repeat(${cols}, ${cellSize}px)`,
            }}
          >
            {/* top left */}
            <div className="corner-cell" />

            {/* columns */}
            {columnLabels.map((label) => (
              <div
                key={label}
                className="header-cell"
                style={{
                  width: cellSize,
                  height: 40,
                }}
              >
                {label}
              </div>
            ))}

            {/* rows */}
            {grid.map((row, rowIndex) => (
              <>
                {/* row number */}
                <div
                  key={`row-${rowIndex}`}
                  className="row-header"
                  style={{
                    height: cellSize,
                  }}
                >
                  {rowIndex + 1}
                </div>

                {/* cells */}
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell ${
                      cell.type || ""
                    }`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                    }}
                    onMouseDown={() =>
                      paintCell(
                        rowIndex,
                        colIndex
                      )
                    }
                    onMouseEnter={() =>
                      handleMouseEnter(
                        rowIndex,
                        colIndex
                      )
                    }
                  />
                ))}
              </>
            ))}
          </div>
        </div>

        {/* TOOL PANEL */}
        <div className="tool-panel">
          <h3>Tool Panel</h3>

          <button
            onClick={() =>
              setSelectedTool("wall")
            }
          >
            Wall
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              setSelectedTool("bedroom")
            }
          >
            Bedroom
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              setSelectedTool("kitchen")
            }
          >
            Kitchen
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              setSelectedTool("bathroom")
            }
          >
            Bathroom
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              setSelectedTool("door")
            }
          >
            Door
          </button>

          <br />
          <br />

          <button
            className="erase-btn"
            onClick={() =>
              setSelectedTool("erase")
            }
          >
            Erase
          </button>

          <br />
          <br />

          <button onClick={clearGrid}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default GridEditor;