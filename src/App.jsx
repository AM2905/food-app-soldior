import React, { useState } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";
import GoodEatingPage from "./pages/GoodEatingPage.jsx";
import BadSigns from "./pages/BadSigns.jsx";
import gamePage from "./pages/GamePage.jsx";

const pages = [FirstPage,OpeningPart,GoodEatingPage,BadSigns,gamePage,FirstPage]; // ✅ נוסף לרשימה

function App() {
  const [pageIndex, setPageIndex] = useState(0); // ✅ הוסר הפרמטר השלישי בטעות

  const CurrentPage = pages[pageIndex];
  const goNext = () => setPageIndex(pageIndex + 1);
  const onHome = () => setPageIndex(pageIndex - 1);

  return (
    <div className="app">
      <CurrentPage onNext={goNext} onHome={onHome}/>
    </div>
  );
}

export default App;