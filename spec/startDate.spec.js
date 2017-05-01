const startDate = require("../src/startDate");
const faker = require('Faker');

describe("startDate", function () {

  it("should get datetime 24 hours ago in iso format", function () {
    // Arrange
    const date = new Date();
    isoDate = new Date(date.setDate(date.getDate() - 1)).toISOString();

    // Act
    let result = startDate();

    // Assert
    expect(result).toContain(isoDate.substring(0, 8));
  });

  it("should get datetime in distant past in iso format", function () {
    // Arrange
    let daysBack = faker.random.number(2, 60);
    const date = new Date();
    isoDate = new Date(date.setDate(date.getDate() - daysBack)).toISOString();

    // Act
    let result = startDate(daysBack);

    // Assert
    expect(result).toContain(isoDate.substring(0, 8));
  });
});  