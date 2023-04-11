import jwt from "jsonwebtoken";

/**
 * description: This middleware is responsible for authenticating the user
 */
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

/**
 * description: This middleware will check if the requested user is the currently logged in user
 * @Usage : This middleware should be used after the userAuthenticatorMiddleware
 * @Usecase : To verify that the user being updated / deleted is the currently logged in user
 */
export const isCurrentUser = async (req, res, next) => {
    try {
        // get the id from the request object
        const id = req.params?.id || req.query?.id;

        // if the id doesnot match the id of the currently logged in user, return 401
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
