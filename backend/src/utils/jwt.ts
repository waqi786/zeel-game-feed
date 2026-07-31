import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: number;
  uuid: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, requireJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, requireJwtSecret()) as TokenPayload;
}

function requireJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}
