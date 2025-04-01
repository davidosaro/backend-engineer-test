import { Model, Document, FilterQuery, UpdateQuery, UpdateWriteOpResult, DeleteResult } from "mongoose";

export default class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async updateOne(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, updateData, { new: true });
  }

  async delete(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }
}
