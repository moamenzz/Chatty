import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader)
    return res
      .status(400)
      .json({ status: "error", message: "Invalid authorization header" });

  try {
    const token = authHeader.split(" ")[1];

    if (!token)
      return res
        .status(400)
        .json({ status: "error", message: "Token is missing" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded)
      return res
        .status(403)
        .json({ status: "error", message: "Invalid access token" });

    req.email = decoded.userinfo.email;
    req.username = decoded.userinfo.username;
    req.roles = decoded.userinfo.roles;
    req.Id = decoded.userinfo.id;

    next();
  } catch (e) {
    console.error(e);
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};
