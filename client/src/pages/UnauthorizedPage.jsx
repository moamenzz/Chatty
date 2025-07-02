import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div>
      <h1 className="text-green-300 text-5xl justify-center pt-16"></h1>
      Unauthorized.
      <Link to="/">Home</Link>
    </div>
  );
};

export default UnauthorizedPage;
