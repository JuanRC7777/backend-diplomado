import bcrypt from "bcryptjs";

//Numero de rondas del hash
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

export function hashPassword(password) {
  
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
