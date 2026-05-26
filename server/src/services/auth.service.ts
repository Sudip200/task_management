import { prisma } from "../prisma/client";
import { hashPassword ,comparePassword } from "../utils/hash";

export const registerUser = async (data: { email: string; password: string }) => {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({
    data: { email: data.email, password: hashed },
  });
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return user;
};

