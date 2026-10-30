export default function Loading({ message = "Loading products..." }) {
  return (
    <div className="loading-wrap">
      <div className="spinner" role="status" aria-label="Loading" />
      <p>{message}</p>
    </div>
  );
}
