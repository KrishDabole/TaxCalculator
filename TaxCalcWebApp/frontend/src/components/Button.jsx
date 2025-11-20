export default function Button({ text, onClick, className = "" }) {
  return (
    <button 
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 ${className}`}
    >
      {text}
    </button>
  );
}