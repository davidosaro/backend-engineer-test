import { Response, NextFunction } from "express";
import { RequestWithAdditions } from "../helpers/interfaces";
import { Role } from "../helpers/enums";
import { ForbiddenError } from "../helpers/errors";

const authorization = (requiredRoles: Role[]) => {
  return async (req: RequestWithAdditions, res: Response, next: NextFunction) => {
    try {
      const role = (req?.user?.role || "") as Role;
      if (!requiredRoles.includes(role) || !role) throw new ForbiddenError("User not permitted for this action");
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorization;
