import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

export function createToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustResetPassword: Boolean(user.must_reset_password),
  };
}
