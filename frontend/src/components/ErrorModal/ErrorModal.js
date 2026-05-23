import "./ErrorModal.css";

function ErrorModal({ obj, onClose }) {
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h2>{obj.title}</h2>
        <p>{obj.message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ErrorModal;