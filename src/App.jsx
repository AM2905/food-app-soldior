import React, { useState, useCallback } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";
import GoodEatingPage from "./pages/GoodEatingPage.jsx";
import BadSigns from "./pages/BadSigns.jsx";
import gamePage from "./pages/GamePage.jsx";
import end from "./pages/end.jsx";

const pages = [FirstPage, GoodEatingPage, OpeningPart, GoodEatingPage, BadSigns, gamePage, end, FirstPage];

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const CurrentPage = pages[pageIndex];
  const goNext      = () => setPageIndex(i => i + 1);
  const onHome      = () => setPageIndex(i => i - 2);
  const onFirstPage = () => setPageIndex(1);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      // iOS Safari doesn't support fullscreen API — hide the button gracefully
      console.warn("Fullscreen not supported:", e);
    }
  }, []);

  // sync state if user presses Escape key
  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div className="app">
      <button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
        aria-label={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
      >
        {isFullscreen ? "✕" : "⛶"}
      </button>
      <CurrentPage onNext={goNext} onHome={onHome} onFirstPage={onFirstPage} />
    </div>
  );
}

export default App;