import { getConsumer } from "../dist/gatelin-express.js";

function mockReq(headers = {}) {
  return { headers };
}

function mockRes() {
  return { locals: {} };
}

function mockNext() {
  return jest.fn();
}

// --- getConsumer ---

describe("getConsumer", () => {

  describe("valid headers", () => {

    it("should call next() with no error and set res.locals.consumer when id and nickname are valid", () => {
      const req = mockReq({ "x-consumer-id": "42", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ id: 42, nickname: "johndoe" });
    });

    it("should cast id to a number in res.locals.consumer", () => {
      const req = mockReq({ "x-consumer-id": "100", "x-consumer-nickname": "validname" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(typeof res.locals.consumer.id).toBe("number");
      expect(res.locals.consumer.id).toBe(100);
    });

    it("should accept id at lower boundary (1)", () => {
      const req = mockReq({ "x-consumer-id": "1", "x-consumer-nickname": "abcde" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ id: 1, nickname: "abcde" });
    });

    it("should accept id at upper boundary (999999999)", () => {
      const req = mockReq({ "x-consumer-id": "999999999", "x-consumer-nickname": "abcde" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ id: 999999999, nickname: "abcde" });
    });

    it("should accept a nickname of exactly 5 characters", () => {
      const req = mockReq({ "x-consumer-id": "10", "x-consumer-nickname": "abcde" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer.nickname).toBe("abcde");
    });

    it("should accept a nickname longer than 5 characters", () => {
      const req = mockReq({ "x-consumer-id": "10", "x-consumer-nickname": "longernickname" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer.nickname).toBe("longernickname");
    });

  });

  describe("invalid consumer id", () => {

    it("should call next() with a 400 error when x-consumer-id header is missing", () => {
      const req = mockReq({ "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
      expect(res.locals.consumer).toBeUndefined();
    });

    it("should call next() with a 400 error when x-consumer-id is 0", () => {
      const req = mockReq({ "x-consumer-id": "0", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-id is negative", () => {
      const req = mockReq({ "x-consumer-id": "-1", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-id exceeds upper boundary", () => {
      const req = mockReq({ "x-consumer-id": "1000000000", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-id is not a number", () => {
      const req = mockReq({ "x-consumer-id": "abc", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-id is a float", () => {
      const req = mockReq({ "x-consumer-id": "1.5", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-id is an empty string", () => {
      const req = mockReq({ "x-consumer-id": "", "x-consumer-nickname": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

  });

  describe("invalid consumer nickname", () => {

    it("should call next() with a 400 error when x-consumer-nickname header is missing", () => {
      const req = mockReq({ "x-consumer-id": "42" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
      expect(res.locals.consumer).toBeUndefined();
    });

    it("should call next() with a 400 error when nickname is shorter than 5 characters", () => {
      const req = mockReq({ "x-consumer-id": "42", "x-consumer-nickname": "abc" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
    });

    it("should call next() with a 400 error when nickname is an empty string", () => {
      const req = mockReq({ "x-consumer-id": "42", "x-consumer-nickname": "" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
    });

    it("should call next() with a 400 error when nickname is exactly 4 characters", () => {
      const req = mockReq({ "x-consumer-id": "42", "x-consumer-nickname": "abcd" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
    });

  });

  describe("both headers invalid or missing", () => {

    it("should call next() with consumer id error when both headers are missing (id checked first)", () => {
      const req = mockReq({});
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
      expect(next).toHaveBeenCalledTimes(1);
    });

  });

});
