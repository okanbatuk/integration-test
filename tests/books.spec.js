const request = require("supertest");
const httpStatus = require("http-status");
const app = require("../configs/express");

describe("Integration tests for the books API", () => {
  let res = {};

  it("GET /api -- not found -- not exist page", async () => {
    res = await request(app).get("/api").set("Accept", "application/json");

    expect(res.status).toEqual(httpStatus.NOT_FOUND);
    expect(res.body).toEqual({});
  });

  it("GET /api/status -- success -- get api status and message", async () => {
    res = await request(app)
      .get("/api/status")
      .set("Accept", "application/json");

    expect(res.status).toEqual(httpStatus.OK);
    expect(res.body).toEqual({ message: "Everything is OK!" });
  });

  it("GET /api/books -- success -- get book page", async () => {
    res = await request(app)
      .get("/api/books")
      .set("Accept", "application/json");

    expect(res.status).toEqual(httpStatus.OK);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          author: expect.any(String),
        }),
      ])
    );
  });

  it("POST /api/books -- failure on invalid post body", async () => {
    res = await request(app)
      .post("/api/books")
      .send({ title: "", author: "John Doe" });

    expect(res.status).toEqual(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      errors: [
        {
          location: "body",
          msg: "Book title is required",
          param: "title",
          value: "",
        },
      ],
    });
  });

  it("POST /api/books -- success", async () => {
    let bookInfo = { title: "Face Off", author: "John Doe" };
    res = await request(app).post("/api/books").send(bookInfo);

    expect(res.status).toEqual(httpStatus.CREATED);
  });

  it("PUT /api/books/:bookid -- failure when book is not found", async () => {
    let bookInfo = { title: "Face Off", author: "John Doe" };
    res = await request(app).put("/api/books/25").send(bookInfo);

    expect(res.status).toEqual(httpStatus.NOT_FOUND);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(Boolean),
        message: expect.any(String),
      })
    );
  });

  it("PUT /api/books/:bookid -- success -- successfully updated", async () => {
    let bookInfo = { title: "Malamender", author: "JOHN DOE" };
    res = await request(app).put("/api/books/9").send(bookInfo);

    expect(res.status).toEqual(httpStatus.NO_CONTENT);
  });

  it("DELETE /api/books/:bookid -- failure when book is not found", async () => {
    res = await request(app).delete("/api/books/50");

    expect(res.status).toEqual(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({ error: true, message: "Something went wrong" });
  });

  it("DELETE /api/books/:bookid -- success -- successfully deleted", async () => {
    res = await request(app).delete("/api/books/10");

    expect(res.status).toEqual(httpStatus.OK);
    expect(res.body).toEqual({
      message: `The book with ID 10 has been deleted!`,
    });
  });
});
