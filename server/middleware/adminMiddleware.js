
const admin = (req, res, next) => {

    console.log("ADMIN CHECK:", req.user);

    if (req.user && req.user.role === "admin") {
        console.log("Admin access granted");
        return next();
    }

    console.log("Admin access denied");

    return res.status(403).json({
        message: "Admin access required",
        receivedRole: req.user?.role || "No role found"
    });
};

module.exports = { admin };
