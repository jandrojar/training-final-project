import { Context } from "koa";
import UserPrismaRepository from "../repositories/UserPrismaRepository";
import { User } from "../models/users";
import { validateUser } from "../services/usersService";

const userRepo = new UserPrismaRepository();

export async function getUsers(ctx: Context): Promise<void> {
  const users = await userRepo.findAll();

  if (users.length === 0) {
    ctx.status = 404;
    ctx.body = { error: "No hay usuarios" };
    return;
  }

  ctx.status = 200;
  ctx.body = users;
}

export async function getUserById(ctx: Context): Promise<void> {
  const id = ctx.params.id;
  const user = await userRepo.findById(id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "No hay usuario con ese ID" };
    return;
  }

  ctx.status = 200;
  ctx.body = user;
}

export async function createUser(ctx: Context): Promise<void> {
  try {
    const payload = ctx.request.body as Partial<User>;
    const normalizedUser = validateUser(payload);
    const createdUser = await userRepo.create(normalizedUser);
    ctx.status = 201;
    ctx.body = createdUser;
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case "missing-fields":
          ctx.status = 400;
          ctx.body = {
            error: "Todos los campos obligatorios deben completarse",
          };
          return;
        case "invalid-age":
          ctx.status = 400;
          ctx.body = { error: "La edad debe estar entre 18 y 120" };
          return;
        case "name-too-long":
          ctx.status = 400;
          ctx.body = {
            error: "Nombre y email no pueden exceder la longitud permitida",
          };
          return;
        case "lastname-too-long":
          ctx.status = 400;
          ctx.body = { error: "El apellido no puede superar 50 caracteres" };
          return;
        case "invalid-email":
          ctx.status = 400;
          ctx.body = { error: "El formato del correo es inválido" };
          return;
        case "email-already-exists":
          ctx.status = 409;
          ctx.body = { error: "El email ya está registrado" };
          return;
        case "password-validation":
          ctx.status = 400;
          ctx.body = { error: "La contraseña no cumple los requisitos" };
          return;
      }
    }

    ctx.status = 500;
    ctx.body = { error: "Error interno en el servidor" };
  }
}

export async function updateUser(ctx: Context): Promise<void> {
  const id = ctx.params.id;

  try {
    const existingUser = await userRepo.findById(id);

    if (!existingUser) {
      ctx.status = 404;
      ctx.body = { error: "No hay usuario con ese ID" };
      return;
    }

    const payload = ctx.request.body as Partial<User>;
    const normalizedUser = validateUser(payload, id);
    const updatedUser = userRepo.update(id, {
      ...existingUser,
      ...normalizedUser,
    });

    if (!updatedUser) {
      ctx.status = 500;
      ctx.body = { error: "No se pudo actualizar el usuario" };
      return;
    }

    ctx.status = 200;
    ctx.body = updatedUser;
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case "missing-fields":
          ctx.status = 400;
          ctx.body = {
            error: "Todos los campos obligatorios deben completarse",
          };
          return;
        case "invalid-age":
          ctx.status = 400;
          ctx.body = { error: "La edad debe estar entre 18 y 120" };
          return;
        case "name-too-long":
          ctx.status = 400;
          ctx.body = {
            error: "Nombre y email no pueden exceder la longitud permitida",
          };
          return;
        case "lastname-too-long":
          ctx.status = 400;
          ctx.body = { error: "El apellido no puede superar 50 caracteres" };
          return;
        case "invalid-email":
          ctx.status = 400;
          ctx.body = { error: "El formato del correo es inválido" };
          return;
        case "email-already-exists":
          ctx.status = 409;
          ctx.body = { error: "El email ya está registrado" };
          return;
        case "password-validation":
          ctx.status = 400;
          ctx.body = { error: "La contraseña no cumple los requisitos" };
          return;
      }
    }

    ctx.status = 500;
    ctx.body = { error: "Error interno en el servidor" };
  }
}

export async function deleteUser(ctx: Context): Promise<void> {
  const id = ctx.params.id;
  const deleted = await userRepo.delete(id);

  if (!deleted) {
    ctx.status = 404;
    ctx.body = { error: "No hay usuario con ese ID" };
    return;
  }

  ctx.status = 204;
 }