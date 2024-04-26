import request from "supertest";
import app from "../../../app";

describe("default function", () => {
  it("should return status 200 for GET request to /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
  });
});
