import { User } from "../models/users";
import UserRepository from "../repositories/UserRepository";

const userRepo = new UserRepository();

export function validateUser(
  input: Partial<User>,
  currentUserId?: string
): Omit<User, "id"> {
  const userData = {
    name: input.name?.trim(),
    lastname: input.lastname?.trim(),
    age: input.age,
    email: input.email?.trim().toLowerCase(),
    password: input.password?.trim(),
  };

  if (!userData.name || !userData.email || userData.age == null || !userData.password) {
    throw new Error("missing-fields");
  }

  if (typeof userData.age !== "number" || userData.age < 18 || userData.age > 120) {
    throw new Error("invalid-age");
  }

  if (userData.name.length > 50 || userData.email.length > 100) {
    throw new Error("name-too-long");
  }

  if (userData.lastname != null && userData.lastname.length > 50) {
    throw new Error("lastname-too-long");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    throw new Error("invalid-email");
  }

  const duplicatedEmail = userRepo
    .findAll()
    .some((u) => u.email === userData.email && u.id !== currentUserId);
  if (duplicatedEmail) {
    throw new Error("email-already-exists");
  }

  if (
    !/[A-Z]/.test(userData.password) ||
    userData.password.length < 6 ||
    userData.password.length > 30
  ) {
    throw new Error("password-validation");
  }

  const normalized: Omit<User, "id"> = {
    name: userData.name,
    age: userData.age,
    email: userData.email,
    password: userData.password,
  };

  if (userData.lastname !== undefined) {
    normalized.lastname = userData.lastname;
  }

  return normalized;
}
