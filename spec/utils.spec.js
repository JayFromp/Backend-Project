const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it('"returns an array containing an object, when passed an array containing an object', () => {
    expect(formatDates([{}])).to.eql([{}]);
  });
  it("returns an array containing an object with its date property changed", () => {
    const input = [{ created_at: 1542284514171 }];
    const expected = [{ created_at: new Date(1542284514171) }];
    expect(formatDates(input)).to.eql(expected);
  });
  it("returns an array containing a number of object with their date properties changed", () => {
    const input = [
      { created_at: 1542284514171 },
      { created_at: 1416140514171 },
      { created_at: 1289996514171 }
    ];
    const output = [
      { created_at: new Date(1542284514171) },
      { created_at: new Date(1416140514171) },
      { created_at: new Date(1289996514171) }
    ];
    expect(formatDates(input)).to.eql(output);
  });
  it("Doesn't mutate the original input", () => {
    const input = [
      { created_at: 1542284514171 },
      { created_at: 1416140514171 },
      { created_at: 1289996514171 }
    ];
    const inputCopy = [
      { created_at: 1542284514171 },
      { created_at: 1416140514171 },
      { created_at: 1289996514171 }
    ];
    makeRefObj(input);
    expect(input).to.eql(inputCopy);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when given an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns an empty object when passed an array containing an empty object ", () => {
    expect(makeRefObj([{}])).to.eql({});
  });
  it("returns a reference object with appropriate key value pair ", () => {
    const input = [{ article_id: 1, title: "A" }];
    const output = { A: 1 };
    expect(makeRefObj(input, "title", "article_id")).to.eql(output);
  });
  it("returns a reference objects with multiple appropriate key value pairs", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const output = { A: 1, B: 2, C: 3 };
    expect(makeRefObj(input, "title", "article_id")).to.eql(output);
  });
  it("doesn't mutate original input", () => {
    const input = [{ article_id: 1, title: "A" }];
    const inputCopy = [{ article_id: 1, title: "A" }];
    makeRefObj(input, "title", "article_id");
    expect(input).to.eql(inputCopy);
  });
});

describe.only("formatComments", () => {
  it("When passed an empty array, returns an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("when passed an array containing an object, formats the object, changing it's 'belongs_to' property to 'article_id', 'created_by' to 'author' and date format ", () => {
    const input = [
      {
        body: "Hello. I'm an article.",
        belongs_to: "Articles are great.",
        created_by: "jay",
        votes: 5,
        created_at: 1542284514171
      }
    ];
    const refObj = {
      belongs_to: 1
    };

    const expected = [
      {
        body: "Hello. I'm an article.",
        article_id: 1,
        author: "jay",
        votes: 5,
        created_at: new Date(1542284514171)
      }
    ];
    expect(formatComments(input, refObj)).to.eql(expected);
  });
});
