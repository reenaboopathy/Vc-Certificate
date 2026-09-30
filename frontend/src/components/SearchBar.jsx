
import { Search, X } from "lucide-react";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search...",
}) {
  const handleClear = () => {
    onChange?.("");
  };

  return (
    <div className="search-bar">
      <Search size={18} />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
