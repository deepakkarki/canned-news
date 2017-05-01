const filterResults = require("../src/filterResults");
const faker = require('Faker');

describe("filterResults", function () {

  it("should filter entries by tag name", function () {
    let feedId = faker.random.number(1, 10);
    let items = [
      [ // Tags
        {
          name: faker.Lorem.sentence(),
          feed_id: feedId,
        },
        {
          name: faker.Lorem.sentence(),
          feed_id: faker.random.number(11, 100),
        },
      ],
      [ // Entries
        {
          title: faker.Lorem.sentence(),
          feed_id: feedId,
        },
        {
          title: faker.Lorem.sentence(),
          feed_id: faker.random.number(11, 100),
        },
        {
          title: faker.Lorem.sentence(),
          feed_id: feedId,
        },
      ]
    ];

    let tag = items[0][0];

    let results = filterResults(items, tag.name);

    expect(results.length).toBe(2);
  });

  it("should return all entries when no tag name", function () {
    let items = [
      [ // Tags
        {
          name: faker.Lorem.sentence(),
          feed_id: faker.random.number(1, 100),
        },
        {
          name: faker.Lorem.sentence(),
          feed_id: faker.random.number(1, 100),
        },
      ],
      [ // Entries
        {
          title: faker.Lorem.sentence(),
          feed_id: faker.random.number(1, 100),
        },
        {
          title: faker.Lorem.sentence(),
          feed_id: faker.random.number(1, 100),
        },
      ]
    ];

    let results = filterResults(items);

    expect(results).toBe(items[1]);

  });
});