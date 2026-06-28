import jwt from "jsonwebtoken";
import {type  SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface UnipassTokenPayload {
  userId: number;
  email: string;
  name?: string | null;
  clientId?: string | null;
}

export interface OAuthStatePayload {
  client_id: string;
  redirect_uri: string;
  state?: string | undefined; // Explicitly allow undefined
}

export const signUnipassCookie = (payload: UnipassTokenPayload): string => {
  const signOptions: SignOptions = {
    expiresIn: "30d" as const
  };
  
  return jwt.sign(
    { 
      userId: payload.userId, 
      email: payload.email, 
      name: payload.name || null,
      clientId: payload.clientId || null 
    }, 
    JWT_SECRET, 
    signOptions
  );
};

export const verifyUnipassCookie = (token: string): UnipassTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name || null,
      clientId: decoded.clientId || null,
    };
  } catch {
    return null;
  }
};

export const signAccessToken = (payload: UnipassTokenPayload): string => {
  const signOptions: SignOptions = {
    expiresIn: "15m" as const
  };
  
  return jwt.sign(
    { 
      userId: payload.userId, 
      email: payload.email, 
      name: payload.name || null,
      clientId: payload.clientId || null 
    }, 
    JWT_SECRET, 
    signOptions
  );
};

export const verifyAccessToken = (token: string): UnipassTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name || null,
      clientId: decoded.clientId || null,
    };
  } catch {
    return null;
  }
};

export const signOAuthState = (payload: OAuthStatePayload): string => {
  const signOptions: SignOptions = {
    expiresIn: "10m" as const
  };
  
  const tokenPayload: any = {
    client_id: payload.client_id,
    redirect_uri: payload.redirect_uri,
  };
  
  // Only add state if it exists and is not undefined
  if (payload.state !== undefined && payload.state !== null) {
    tokenPayload.state = payload.state;
  }
  
  return jwt.sign(tokenPayload, JWT_SECRET, signOptions);
};

export const verifyOAuthState = (token: string): OAuthStatePayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const result: OAuthStatePayload = {
      client_id: decoded.client_id,
      redirect_uri: decoded.redirect_uri,
    };
    if (decoded.state) {
      result.state = decoded.state;
    }
    return result;
  } catch {
    return null;
  }
};