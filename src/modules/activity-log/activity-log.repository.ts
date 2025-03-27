import BaseRepository from "../../common/base.repository";
import activityLogModel from "./activity-log.model";
import { IActivityLogModel } from "./activity-log.interface";

export default class ActivityLogRepository extends BaseRepository<IActivityLogModel> {
  constructor() {
    super(activityLogModel);
  }
}
