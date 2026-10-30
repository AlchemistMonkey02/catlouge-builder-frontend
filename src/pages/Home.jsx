import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const CATEGORY_LINKS = ["Electronics", "Fashion", "Home", "Sports", "Books"];

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-eyebrow">Product Catalog</div>
        <h1>Every category, catalogued and searchable.</h1>
        <p>
          Browse electronics, fashion, home essentials, sports gear and books — filtered,
          sorted, and paginated on the server so the catalog stays fast at any scale.
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <section className="container" style={{ padding: "40px 20px 60px" }}>
        <div className="filter-chip-row" style={{ justifyContent: "center" }}>
          {CATEGORY_LINKS.map((cat) => (
            <button
              key={cat}
              type="button"
              className="filter-chip"
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
            >
              {cat}
            </button>
          ))}
          <button type="button" className="filter-chip" onClick={() => navigate("/products")}>
            View all products →
          </button>
        </div>
      </section>
    </>
  );
}
