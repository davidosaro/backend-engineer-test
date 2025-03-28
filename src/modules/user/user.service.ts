import { RESPONSE_MESSAGES } from "../../helpers/constants";
import { ForbiddenError, NotFoundError } from "../../helpers/errors";
import { IUserModel } from "../../helpers/interfaces/index";
import { generateRefreshToken, generateToken } from "../../helpers/jwt";
import UserRepository from "./user.repository";
import bcrypt from "bcryptjs";

export default class UserService {
  userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async validateUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
    return user;
  }

  async registerUser(userObj: Partial<IUserModel>) {
    const { password = "" } = userObj;
    const hashedPassword = await bcrypt.hash(password, 10);
    const requestBody = { ...userObj, password: hashedPassword };

    // check if username exist
    // check if email exist
    const user = await this.userRepository.create(requestBody);
    return user;
  }

  async loginUser(userObj: Partial<IUserModel>) {
    const { email, password = "" } = userObj;

    const user = await this.userRepository.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new ForbiddenError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);

    const { id = "", role = "" } = user;
    const accessToken = generateToken({ id, role });
    const refreshToken = generateRefreshToken({ id, role });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
}
