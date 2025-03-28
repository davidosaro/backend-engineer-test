import BaseRepository from "../../common/base.repository";
import userModel from "./user.model";
import { IUserModel } from "../../helpers/interfaces/index";

export default class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super(userModel);
  }
}
