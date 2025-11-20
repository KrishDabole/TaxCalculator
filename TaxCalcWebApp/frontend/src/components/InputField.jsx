export default function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-text-dark text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card-bg text-text-dark placeholder-text-light transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );
}
