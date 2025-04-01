import { PAGINATION_OPTIONS } from "../../helpers/constants";
import { getLimitAndOffset, getPagination, getSearchWhereCase, getPaginationQuery, trimModel } from "../../helpers";
import { IGetProducts } from "../../helpers/interfaces";
import { IProductSearchKey } from "../../helpers/enums";

describe("Utils functions tests", () => {
  describe("trimModel function", () => {
    it("should transform object by renaming _id to id and removing __v and _id", () => {
      const model = {
        _id: "123",
        __v: 1,
        name: "Product",
      };
      const transformed = trimModel().transform({}, model);
      expect(transformed).toEqual({
        id: "123",
        name: "Product",
      });
      expect(transformed).not.toHaveProperty("_id");
      expect(transformed).not.toHaveProperty("__v");
    });
  });

  describe("getLimitAndOffset function", () => {
    it("should return default values if no page or size are provided", () => {
      const result = getLimitAndOffset();
      expect(result.limit).toBe(PAGINATION_OPTIONS.size);
      expect(result.offset).toBe(0);
    });

    it("should calculate limit and offset based on the given page and size", () => {
      const result = getLimitAndOffset("2", "10");
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(10);
    });

    it("should handle invalid page and size values gracefully", () => {
      const result = getLimitAndOffset("invalid", "invalid");
      expect(result.limit).toBe(PAGINATION_OPTIONS.size);
      expect(result.offset).toBe(0);
    });
  });

  describe("getPagination function", () => {
    it("should return default pagination values when data is null or empty", () => {
      const result = getPagination(null, "1", "10");
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(0);
      expect(result.records).toEqual([]);
    });

    it("should correctly calculate pagination with valid data", () => {
      const data = { count: 50, rows: [{ id: 1 }, { id: 2 }] };
      const result = getPagination(data, "2", "10");
      expect(result.totalItems).toBe(50);
      expect(result.totalPages).toBe(5);
      expect(result.currentPage).toBe(2);
      expect(result.records).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe("getSearchWhereCase function", () => {
    it("should return whereCase with default values when no search parameters are provided", () => {
      const queryObj: IGetProducts = { searchKey: "" as IProductSearchKey, searchValue: "", status: "" };
      const result = getSearchWhereCase(queryObj);
      expect(result).toEqual({ isDeleted: false });
    });

    it("should include searchKey and searchValue in the whereCase", () => {
      const queryObj: IGetProducts = { searchKey: IProductSearchKey.NAME, searchValue: "Product", status: "" };
      const result = getSearchWhereCase(queryObj);
      expect(result).toEqual({
        isDeleted: false,
        name: "Product",
      });
    });

    it("should include status in the whereCase", () => {
      const queryObj: IGetProducts = { searchKey: "" as IProductSearchKey, searchValue: "", status: "active" };
      const result = getSearchWhereCase(queryObj);
      expect(result).toEqual({
        isDeleted: false,
        status: "active",
      });
    });
  });

  describe("getPaginationQuery function", () => {
    it("should return correct query object with pagination and where case", () => {
      const queryObj: IGetProducts = { page: "2", size: "10", searchKey: IProductSearchKey.NAME, searchValue: "Product", status: "active" };
      const result = getPaginationQuery(queryObj);

      expect(result.limit).toBe(10);
      expect(result.offset).toBe(10);
      expect(result.whereCase).toEqual({
        isDeleted: false,
        name: "Product",
        status: "active",
      });
    });
  });
});
