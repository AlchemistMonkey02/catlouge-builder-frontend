import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/api";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

const LIMIT = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // Derive the current filter/sort/page state directly from the URL so
  // the page is shareable/bookmarkable and survives a refresh.
  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "newest",
  };
  const page = Number(searchParams.get("page")) || 1;

  const updateParams = useCallback(
    (partial, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(partial).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      if (resetPage) next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setStatus("loading");
      try {
        const data = await fetchProducts({ ...filters, page, limit: LIMIT });
        if (ignore) return;
        setProducts(data.products);
        setPagination(data.pagination);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(err?.response?.data?.message || "Something went wrong while loading products.");
        setStatus("error");
      }
    };

    load();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleReset = () => setSearchParams({});

  return (
    <div className="catalog-layout">
      <FilterSidebar filters={filters} onChange={updateParams} onReset={handleReset} />

      <div>
        <div style={{ marginBottom: 20 }}>
          <SearchBar initialValue={filters.search} onSearch={(q) => updateParams({ search: q })} />
        </div>

        <div className="products-toolbar">
          <span className="result-count">
            {status === "success" && (
              <>
                <strong>{pagination.totalProducts}</strong> products found
              </>
            )}
          </span>

          <select
            className="sort-select"
            value={filters.sort}
            onChange={(e) => updateParams({ sort: e.target.value }, { resetPage: false })}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="product-grid">
          {status === "loading" && <Loading />}

          {status === "error" && (
            <div className="state-block error">
              <h3>Couldn't load products</h3>
              <p>{errorMessage}</p>
            </div>
          )}

          {status === "success" && products.length === 0 && (
            <div className="state-block">
              <h3>No products found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}

          {status === "success" &&
            products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>

        {status === "success" && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(p) => updateParams({ page: p }, { resetPage: false })}
          />
        )}
      </div>
    </div>
  );
}
