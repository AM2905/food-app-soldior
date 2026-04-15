import "../css/style.css";

export default function OpeningPart({ onNext }) {
  return (
    <div className="oppeningPart-container">
      <button className="next-button" onClick={onNext}>
        המשך
      </button>
    </div>
  );
}