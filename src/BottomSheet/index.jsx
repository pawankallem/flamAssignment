import { useEffect, useState } from "react";
import "./style.css";

export const BottomSheet = () => {
  const [sheetHeight, setSheetHeight] = useState(8);
  const [dragPosition, setDragPosition] = useState(undefined);
  const [addClass, setAddClass] = useState(false);

  const touchPosition = (event) => (event.touches ? event.touches[0] : event);

  const onDragStart = (event) => {
    let y = touchPosition(event).pageY;
    setDragPosition(y);
    setAddClass(true);
    document.body.style.cursor = "grabbing";
  };

  const onDragMove = (event, hi) => {
    if (dragPosition === undefined) return;
    const y = touchPosition(event).pageY;
    const deltaY = dragPosition - y;
    setDragPosition(y);
    const deltaHeight = (deltaY / window.innerHeight) * 100;
    setSheetHeight(sheetHeight + deltaHeight);
  };

  const onDragEnd = () => {
    setDragPosition(undefined);
    setAddClass(false);
    document.body.style.cursor = "";
    if (sheetHeight < 25) {
      setSheetHeight(8);
    } else if (sheetHeight > 75) {
      setSheetHeight(100);
    } else {
      setSheetHeight(50);
    }
  };

  const handleEscape = (event) => {
    if (event.key === "Escape" && sheetHeight != 8) {
      setSheetHeight(8);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleEscape);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchend", onDragEnd);

    return () => {
      window.removeEventListener("keyup", handleEscape);
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [addClass, dragPosition]);

  return (
    <div className="bottom-sheet-container">
      <div id="sheet" className="sheet" role="dialog">
        <div className="overlay" onClick={() => setSheetHeight(8)}></div>
        <div
          style={{ height: `${sheetHeight}vh` }}
          className={
            sheetHeight == 100
              ? addClass
                ? "contents fullscreen not-selectable"
                : "contents fullscreen"
              : addClass
              ? "contents not-selectable"
              : "contents"
          }
        >
          <header className="controls">
            <div
              className="draggable-area"
              onMouseDown={onDragStart}
              onTouchStart={onDragStart}
              style={{ cursor: `${addClass ? "grabbing" : ""}` }}
            >
              <div className="draggable-thumb"></div>
            </div>
            {sheetHeight > 25 && (
              <button
                className="close-sheet"
                title="Close the sheet"
                onClick={() => setSheetHeight(8)}
              >
                X
              </button>
            )}
          </header>
        </div>
      </div>
    </div>
  );
};
