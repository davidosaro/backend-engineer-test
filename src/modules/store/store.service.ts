import { FilterQuery } from "mongoose";
import { IStoreModel, IUserModel } from "../../helpers/interfaces";
import StoreRepository from "./store.repository";
import { RESPONSE_MESSAGES } from "../../helpers/constants";
import UserService from "../user/user.service";

export default class StoreService {
  storeRepository: StoreRepository;
  userService: UserService;

  constructor() {
    this.storeRepository = new StoreRepository();
    this.userService = new UserService();
  }

  async createStore(data: Partial<IStoreModel>, user: Partial<IUserModel> = {}): Promise<IStoreModel> {
    const { name } = data;
    const { username, _id = "" } = user;
    const storeExists = await this.checkIfStoreExists({ name });
    if (storeExists) throw new Error(RESPONSE_MESSAGES.STORE_EXISTS);

    await this.userService.validateUser(_id);
    return this.storeRepository.create({ ...data, createdBy: username, ownerId: _id });
  }

  async getStoreById(id: string): Promise<IStoreModel | null> {
    const store = await this.storeRepository.findById(id);
    if (!store) throw new Error(RESPONSE_MESSAGES.STORE_NOT_FOUND);
    return store;
  }
  async checkIfStoreExists(args: FilterQuery<IStoreModel>) {
    const user = await this.storeRepository.findOne(args);
    return !!user;
  }
}
