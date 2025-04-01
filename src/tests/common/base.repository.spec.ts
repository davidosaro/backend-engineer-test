import { Model, Document } from "mongoose";
import BaseRepository from "../../common/base.repository";

const mockDocument = {
  _id: "1",
  __v: 0,
  name: "John Doe",
  email: "john@example.com",
  save: jest.fn().mockResolvedValue(true),
  toJSON: jest.fn().mockReturnValue({
    _id: "1",
    __v: 0,
    name: "John Doe",
    email: "john@example.com",
  }),
} as unknown as Document;

const mockModel = {
  create: jest.fn().mockResolvedValue(mockDocument),
  find: jest.fn().mockResolvedValue([mockDocument]),
  findOne: jest.fn().mockResolvedValue(mockDocument),
  findById: jest.fn().mockResolvedValue(mockDocument),
  updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
  deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
} as unknown as jest.Mocked<Model<Document>>;

describe("BaseRepository", () => {
  let repository: BaseRepository<Document>;

  beforeEach(() => {
    repository = new BaseRepository(mockModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a document", async () => {
    const mockData = { name: "John Doe", email: "john@example.com" };

    const result = await repository.create(mockData as unknown as Document);

    expect(result).toEqual(mockDocument);
    expect(mockModel.create).toHaveBeenCalledWith(mockData);
  });

  it("should find multiple documents", async () => {
    const mockDocuments = [mockDocument, { ...mockDocument, _id: "2", name: "Jane Smith" }];

    mockModel.find.mockResolvedValue(mockDocuments);

    const result = await repository.find({});

    expect(result).toEqual(mockDocuments);
    expect(mockModel.find).toHaveBeenCalledWith({});
  });

  it("should find a single document by filter", async () => {
    const result = await repository.findOne({ _id: "1" });

    expect(result).toEqual(mockDocument);
    expect(mockModel.findOne).toHaveBeenCalledWith({ _id: "1" });
  });

  it("should find a document by id", async () => {
    const result = await repository.findById("1");

    expect(result).toEqual(mockDocument);
    expect(mockModel.findById).toHaveBeenCalledWith("1");
  });

  it("should update a document", async () => {
    const filter = { _id: "1" };
    const updateData = { name: "John Updated" };
    const mockUpdateResult = { modifiedCount: 1 };

    const result = await repository.updateOne(filter, updateData);

    expect(result).toEqual(mockUpdateResult);
    expect(mockModel.updateOne).toHaveBeenCalledWith(filter, updateData, { new: true });
  });

  it("should delete a document", async () => {
    const filter = { _id: "1" };
    const mockDeleteResult = { deletedCount: 1 };

    const result = await repository.delete(filter);

    expect(result).toEqual(mockDeleteResult);
    expect(mockModel.deleteOne).toHaveBeenCalledWith(filter);
  });
});
