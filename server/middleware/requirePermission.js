const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// permission: a string like 'products:add' or 'categories:edit'
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies && req.cookies.user_token;
      if (!token) return res.status(401).json({ error: "Not authenticated" });

      const { _id } = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(_id, { password: 0 });
      if (!user) return res.status(401).json({ error: "User not found" });

      // attach user to request for handlers that may need it
      req.user = user;

      // superAdmin bypasses permission checks
      if (user.role === "superAdmin") return next();

      if (!user.permissions || !Array.isArray(user.permissions)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (user.permissions.includes(permission)) return next();

      return res.status(403).json({ error: "Forbidden" });
    } catch (err) {
      return res.status(401).json({ error: "Authentication failed" });
    }
  };
};

module.exports = requirePermission;
