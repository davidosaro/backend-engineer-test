import UserRepository from "../../modules/user/user.repository";
import userModel from "../../modules/user/user.model";
import BaseRepository from "../../common/base.repository";
import { IUserModel } from "../../helpers/interfaces";

jest.mock("../../common/base.repository");

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository();
  });

  it("should be an instance of BaseRepository", () => {
    expect(userRepository).toBeInstanceOf(BaseRepository);
  });

  it("should call BaseRepository constructor with userModel", () => {
    expect(BaseRepository).toHaveBeenCalledWith(userModel);
  });

  it("should have inherited BaseRepository methods", () => {
    expect(typeof userRepository.create).toBe("function");
    expect(typeof userRepository.findOne).toBe("function");
    expect(typeof userRepository.delete).toBe("function");
  });

  it("should call create method from BaseRepository", async () => {
    const mockUser: Partial<IUserModel> = {
      email: "test@example.com",
      username: "John Doe",
    };

    userRepository.create(mockUser as IUserModel);
    expect(BaseRepository.prototype.create).toHaveBeenCalledWith(mockUser);
  });

  it("should call findOne method from BaseRepository", async () => {
    const mockQuery = { email: "test@example.com" };

    userRepository.findOne(mockQuery);
    expect(BaseRepository.prototype.findOne).toHaveBeenCalledWith(mockQuery);
  });
});
