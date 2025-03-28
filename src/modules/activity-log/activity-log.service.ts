import { IActivityLogModel } from "../../helpers/interfaces/index";
import ActivityLogRepository from "./activity-log.repository";

export default class ActivityLogService {
  activityLogRepository: ActivityLogRepository;
  constructor() {
    this.activityLogRepository = new ActivityLogRepository();
  }
  async createActivity(data: Partial<IActivityLogModel>): Promise<IActivityLogModel> {
    return this.activityLogRepository.create(data);
  }
  async getAllActivities(id: string): Promise<IActivityLogModel[]> {
    return this.activityLogRepository.find({ ref: id });
  }
}
