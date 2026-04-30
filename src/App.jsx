import React, { useState } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";
import GoodEatingPage from "./pages/GoodEatingPage.jsx";
import BadSigns from "./pages/BadSigns.jsx";
import gamePage from "./pages/GamePage.jsx";
import end from "./pages/end.jsx";

const pages = [FirstPage,gamePage,GoodEatingPage,BadSigns,gamePage,end,FirstPage]; // ✅ נוסף לרשימה

function App() {
  const [pageIndex, setPageIndex] = useState(0); // ✅ הוסר הפרמטר השלישי בטעות

  const CurrentPage = pages[pageIndex];
  const goNext = () => setPageIndex(pageIndex + 1);
  const onHome = () => setPageIndex(pageIndex - 2);
  const onFirstPage = () => setPageIndex(1);

  return (
    <div className="app">
      <CurrentPage onNext={goNext} onHome={onHome} onFirstPage={onFirstPage}/>
    </div>
  );
}

export default App;