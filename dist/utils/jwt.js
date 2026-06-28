import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const signUnipassCookie = (payload) => {
    const signOptions = {
        expiresIn: "30d"
    };
    return jwt.sign({
        userId: payload.userId,
        email: payload.email,
        name: payload.name || null,
        clientId: payload.clientId || null
    }, JWT_SECRET, signOptions);
};
export const verifyUnipassCookie = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name || null,
            clientId: decoded.clientId || null,
        };
    }
    catch {
        return null;
    }
};
export const signAccessToken = (payload) => {
    const signOptions = {
        expiresIn: "15m"
    };
    return jwt.sign({
        userId: payload.userId,
        email: payload.email,
        name: payload.name || null,
        clientId: payload.clientId || null
    }, JWT_SECRET, signOptions);
};
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name || null,
            clientId: decoded.clientId || null,
        };
    }
    catch {
        return null;
    }
};
export const signOAuthState = (payload) => {
    const signOptions = {
        expiresIn: "10m"
    };
    const tokenPayload = {
        client_id: payload.client_id,
        redirect_uri: payload.redirect_uri,
    };
    // Only add state if it exists and is not undefined
    if (payload.state !== undefined && payload.state !== null) {
        tokenPayload.state = payload.state;
    }
    return jwt.sign(tokenPayload, JWT_SECRET, signOptions);
};
export const verifyOAuthState = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = {
            client_id: decoded.client_id,
            redirect_uri: decoded.redirect_uri,
        };
        if (decoded.state) {
            result.state = decoded.state;
        }
        return result;
    }
    catch {
        return null;
    }
};
