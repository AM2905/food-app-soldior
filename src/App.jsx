import React, { useState, useEffect, useCallback } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";
import GoodEatingPage from "./pages/GoodEatingPage.jsx";
import BadSigns from "./pages/BadSigns.jsx";
import gamePage from "./pages/GamePage.jsx";
import end from "./pages/end.jsx";

const pages = [FirstPage, OpeningPart, GoodEatingPage, BadSigns, gamePage, end, FirstPage];

// תמיכה גם ב-webkit (Safari/iOS בתוך iframe כמו Genially)
const el = document.documentElement;
const supportsFullscreen =
  !!el.requestFullscreen ||
  !!el.webkitRequestFullscreen;

function App() {
  const [pageIndex, setPageIndex]       = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const CurrentPage = pages[pageIndex];
  const goNext      = () => setPageIndex(i => i + 1);
  const onHome      = () => setPageIndex(i => i - 2);
  const onFirstPage = () => setPageIndex(1);

  useEffect(() => {
    if (!supportsFullscreen) return;
    const handler = () =>
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!supportsFullscreen) return;
    try {
      const isIn = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isIn) {
        // כניסה למסך מלא — עם webkit fallback לסafari
        if (el.requestFullscreen)        await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else {
        // יציאה
        if (document.exitFullscreen)             await document.exitFullscreen();
        else if (document.webkitExitFullscreen)  document.webkitExitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen error:", e);
    }
  }, []);

  return (
    <div className="app">
      {supportsFullscreen && (
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "exit fullscreen" : "fullscreen"}
        >
          {isFullscreen ? "✕" : "⛶"}
        </button>
      )}
      <CurrentPage onNext={goNext} onHome={onHome} onFirstPage={onFirstPage} />
    </div>
  );
}

export default App;