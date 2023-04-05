import jwt from "jsonwebtoken";

export const userAuthenticatorMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Token not found",
                },
            });
        }
        const authHeader = req.headers["authorization"];
        const bearerToken = authHeader?.split(" ");
        const [bearerValue, token] = bearerToken;
        if (bearerValue === "Bearer" && token) {
            try {
                const verifyData = jwt.verify(token, process.env.JWT_SECRET);
                res.locals.authData = verifyData;
                res.locals.authData.success = true;
            } catch (error) {
                return res.status(401).json({
                    error: {
                        status: 401,
                        message: `Acessed Denied ... +++++ ${error}`,
                    },
                });
            }
        } else {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Bearer Token not found",
                },
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: {
                status: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};

export const isCurrentUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id !== res.locals.authData._id) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Access Denied",
                },
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: {
                status: 500,
                message: "Internal Server Error",
                details: error.message,
            },
        });
    }
};
