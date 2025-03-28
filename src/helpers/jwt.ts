import jwt from "jsonwebtoken";
import { IUserCredentials } from "./interfaces";
import { RESPONSE_MESSAGES } from "./constants";
import { ForbiddenError } from "./errors";
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
  if (!decoded) throw new ForbiddenError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
  return decoded;
};

export const verifyRefreshToken = async (token: string) => {
  const decoded = jwt.verify(token, refreshKey);
  if (!decoded) throw new ForbiddenError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
  return decoded;
};
