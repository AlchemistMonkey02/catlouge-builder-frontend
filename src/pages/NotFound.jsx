import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-wrap">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
