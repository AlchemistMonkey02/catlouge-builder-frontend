import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const getStockInfo = (stock) => {
  if (stock <= 0) return { label: "Out of stock", className: "out-of-stock" };
  if (stock <= 10) return { label: `Only ${stock} left`, className: "low-stock" };
  return { label: "In stock", className: "in-stock" };
};

export default function ProductCard({ product }) {
  const stockInfo = getStockInfo(product.stock);

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <span className="product-card-brand">{product.brand}</span>
        <span className={`stock-pill ${stockInfo.className}`}>{stockInfo.label}</span>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <span className="product-card-rating">★ {product.rating?.toFixed(1) ?? "0.0"}</span>
        </div>
        <Link to={`/products/${product._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
