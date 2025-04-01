import jwt from "jsonwebtoken";
import { IUserCredentials } from "./interfaces";
import { accessKey, refreshKey } from "../config";

export const generateToken = (userObj: IUserCredentials): string => {
  return jwt.sign(userObj, accessKey, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (userObj: IUserCredentials): string => {
  return jwt.sign(userObj, refreshKey, {
    expiresIn: "7d",
  });
};

export const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, accessKey);
  return decoded;
};

export const verifyRefreshToken = async (token: string) => {
  const decoded = jwt.verify(token, refreshKey);
  return decoded;
};
