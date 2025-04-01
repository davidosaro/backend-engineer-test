import BaseRepository from "../../common/base.repository";
import storeModel from "./store.model";
import { IStoreModel } from "../../helpers/interfaces/index";

export default class StoreRepository extends BaseRepository<IStoreModel> {
  constructor() {
    super(storeModel);
  }
}
