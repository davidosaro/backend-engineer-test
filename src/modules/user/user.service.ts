import { FilterQuery } from "mongoose";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../helpers/errors";
import { IUserModel } from "../../helpers/interfaces/index";
import { generateRefreshToken, generateToken } from "../../helpers/jwt";
import UserRepository from "./user.repository";
import bcrypt from "bcryptjs";

export default class UserService {
  userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(data: Partial<IUserModel>) {
    const { password = "", username = "", email = "" } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const requestBody = { ...data, password: hashedPassword };

    const usernameExists = await this.checkIfUserExists({ username });
    if (usernameExists) {
      throw new BadRequestError(RESPONSE_MESSAGES.USERNAME_EXISTS);
    }
    const emailExists = await this.checkIfUserExists({ email });
    if (emailExists) {
      throw new BadRequestError(RESPONSE_MESSAGES.EMAIL_EXISTS);
    }
    const user = await this.userRepository.create(requestBody);
    return user;
  }

  async loginUser(data: Partial<IUserModel>) {
    const { email, password = "" } = data;

    const user = await this.userRepository.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);

    const { id = "", role = "" } = user;
    const accessToken = generateToken({ id, role });
    const refreshToken = generateRefreshToken({ id, role });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async validateUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
    return user;
  }

  async checkIfUserExists(args: FilterQuery<IUserModel>) {
    const user = await this.userRepository.findOne(args);
    return !!user;
  }
}
