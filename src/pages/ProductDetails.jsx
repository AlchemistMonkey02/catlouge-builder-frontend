import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../services/api";
import Loading from "../components/Loading";
import { Sparkles, Camera } from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setStatus("loading");
      try {
        const data = await fetchProductById(id);
        if (ignore) return;
        setProduct(data.product);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          err?.response?.status === 404
            ? "This product doesn't exist or may have been removed."
            : "Something went wrong while loading this product."
        );
        setStatus("error");
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="details-wrap">
        <Loading message="Loading product..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="details-wrap">
        <div className="state-block error">
          <h3>Couldn't load this product</h3>
          <p>{errorMessage}</p>
          <Link to="/products" className="back-link" style={{ marginTop: 16 }}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const navigate = useNavigate();
  const stockLabel = product.stock <= 0 ? "Out of stock" : `${product.stock} units available`;

  return (
    <div className="details-wrap">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="details-grid">
        <div className="details-image" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <img src={product.image} alt={product.name} style={{ borderRadius: "var(--radius-md)" }} />
          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            }}
            onClick={() =>
              navigate("/ai-studio", {
                state: {
                  image: product.image,
                  productId: product._id,
                },
              })
            }
          >
            <Sparkles size={18} />
            <span>✨ Shoot in AI Photo Studio</span>
          </button>
        </div>

        <div>
          <div className="details-category">{product.category}</div>
          <h1 className="details-name">{product.name}</h1>
          <div className="details-brand">by {product.brand}</div>

          <div className="details-price">{formatPrice(product.price)}</div>
          <div className="details-rating">★ {product.rating?.toFixed(1) ?? "0.0"} rating</div>

          <p className="details-description">{product.description}</p>

          <hr className="details-divider" />

          <p>
            <strong>Stock status:</strong> {stockLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
