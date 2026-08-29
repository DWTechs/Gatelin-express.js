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

    it("should call next() with no error and set res.locals.consumer when userId and nickname are valid", () => {
      const req = mockReq({ "x-consumer-user-id": "42", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ userId: 42, nickname: "johndoe" });
    });

    it("should cast userId to a number in res.locals.consumer", () => {
      const req = mockReq({ "x-consumer-user-id": "100", "x-consumer-name": "validname" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(typeof res.locals.consumer.userId).toBe("number");
      expect(res.locals.consumer.userId).toBe(100);
    });

    it("should accept userId at lower boundary (1)", () => {
      const req = mockReq({ "x-consumer-user-id": "1", "x-consumer-name": "abc" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ userId: 1, nickname: "abc" });
    });

    it("should accept userId at upper boundary (999999999)", () => {
      const req = mockReq({ "x-consumer-user-id": "999999999", "x-consumer-name": "abc" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer).toEqual({ userId: 999999999, nickname: "abc" });
    });

    it("should accept a nickname of exactly 3 characters", () => {
      const req = mockReq({ "x-consumer-user-id": "10", "x-consumer-name": "abc" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer.nickname).toBe("abc");
    });

    it("should accept a nickname longer than 3 characters", () => {
      const req = mockReq({ "x-consumer-user-id": "10", "x-consumer-name": "longernickname" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.consumer.nickname).toBe("longernickname");
    });

  });

  describe("invalid consumer id", () => {

    it("should call next() with a 400 error when x-consumer-user-id header is missing", () => {
      const req = mockReq({ "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
      expect(res.locals.consumer).toBeUndefined();
    });

    it("should call next() with a 400 error when x-consumer-user-id is 0", () => {
      const req = mockReq({ "x-consumer-user-id": "0", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-user-id is negative", () => {
      const req = mockReq({ "x-consumer-user-id": "-1", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-user-id exceeds upper boundary", () => {
      const req = mockReq({ "x-consumer-user-id": "1000000000", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-user-id is not a number", () => {
      const req = mockReq({ "x-consumer-user-id": "abc", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-user-id is a float", () => {
      const req = mockReq({ "x-consumer-user-id": "1.5", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

    it("should call next() with a 400 error when x-consumer-user-id is an empty string", () => {
      const req = mockReq({ "x-consumer-user-id": "", "x-consumer-name": "johndoe" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer Id" });
    });

  });

  describe("invalid consumer nickname", () => {

    it("should call next() with a 400 error when x-consumer-name header is missing", () => {
      const req = mockReq({ "x-consumer-user-id": "42" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
      expect(res.locals.consumer).toBeUndefined();
    });

    it("should call next() with a 400 error when nickname is an empty string", () => {
      const req = mockReq({ "x-consumer-user-id": "42", "x-consumer-name": "" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Missing consumer nickname" });
    });

    it("should call next() with a 400 error when nickname is shorter than 3 characters", () => {
      const req = mockReq({ "x-consumer-user-id": "42", "x-consumer-name": "ab" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Invalid consumer nickname" });
    });

    it("should call next() with a 400 error when nickname is exactly 2 characters", () => {
      const req = mockReq({ "x-consumer-user-id": "42", "x-consumer-name": "ab" });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Invalid consumer nickname" });
    });

    it("should call next() with a 400 error when nickname exceeds 30 characters", () => {
      const req = mockReq({ "x-consumer-user-id": "42", "x-consumer-name": "a".repeat(31) });
      const res = mockRes();
      const next = mockNext();

      getConsumer(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 400, msg: "Invalid consumer nickname" });
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
