const CATEGORIES = ["Electronics", "Fashion", "Home", "Sports", "Books"];

/**
 * `filters` shape: { category, brand, minPrice, maxPrice, rating }
 * `onChange(nextFiltersPartial)` merges into the parent's filter state.
 */
export default function FilterSidebar({ filters, onChange, onReset }) {
  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <div className="filter-chip-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${filters.category === cat ? "active" : ""}`}
              onClick={() => onChange({ category: filters.category === cat ? "" : cat })}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="brand-input">Brand</label>
        <input
          id="brand-input"
          type="text"
          placeholder="e.g. Nike, Apple"
          value={filters.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          style={{
            width: "100%",
            padding: "9px 10px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="filter-group">
        <label>Price range (₹)</label>
        <div className="price-range-inputs">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="rating-select">Minimum rating</label>
        <select
          id="rating-select"
          value={filters.rating}
          onChange={(e) => onChange({ rating: e.target.value })}
        >
          <option value="">Any rating</option>
          <option value="4">4★ &amp; up</option>
          <option value="3">3★ &amp; up</option>
          <option value="2">2★ &amp; up</option>
        </select>
      </div>

      <button type="button" className="filter-reset" onClick={onReset}>
        Reset filters
      </button>
    </aside>
  );
}
