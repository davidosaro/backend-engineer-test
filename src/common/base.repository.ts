import { Model, Document, FilterQuery, UpdateQuery, UpdateWriteOpResult, DeleteResult } from "mongoose";

export default abstract class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async updateOne(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, updateData, { new: true }).exec();
  }

  async delete(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter, updateData);
  }
}
