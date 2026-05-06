import React, { useState, useEffect, useCallback } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";
import GoodEatingPage from "./pages/GoodEatingPage.jsx";
import BadSigns from "./pages/BadSigns.jsx";
import gamePage from "./pages/GamePage.jsx";
import end from "./pages/end.jsx";

const pages = [FirstPage, OpeningPart, GoodEatingPage, BadSigns, gamePage, end, FirstPage];

// האם הדפדפן תומך ב-Fullscreen API (Android כן, iOS לא)
const supportsFullscreen = !!document.documentElement.requestFullscreen;

function App() {
  const [pageIndex, setPageIndex]     = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const CurrentPage = pages[pageIndex];
  const goNext      = () => setPageIndex(i => i + 1);
  const onHome      = () => setPageIndex(i => i - 2);
  const onFirstPage = () => setPageIndex(1);

  // עדכון state כשמשתמש לוחץ Escape
  useEffect(() => {
    if (!supportsFullscreen) return;
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!supportsFullscreen) return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen error:", e);
    }
  }, []);

  return (
    <div className="app">
      {/* הכפתור מוצג רק אם הדפדפן תומך (Android/Desktop) */}
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