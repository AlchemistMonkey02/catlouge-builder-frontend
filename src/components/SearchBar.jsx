import { useState } from "react";

/**
 * Controlled search input. Calls onSearch(value) when the user submits
 * (press Enter or click the button) rather than on every keystroke,
 * so we don't fire an API request per character typed.
 */
export default function SearchBar({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products (e.g. iphone, headphones, jeans)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search products"
      />
      <button type="submit">Search</button>
    </form>
  );
}
