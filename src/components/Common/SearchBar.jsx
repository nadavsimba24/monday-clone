import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
      />
      {value && (
        <FiX className="search-clear" onClick={() => onChange('')} />
      )}
    </div>
  );
}
