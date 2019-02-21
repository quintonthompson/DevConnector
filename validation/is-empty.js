//value is parameter of a function, since its an arrow function dont need return or brackets
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "String" && value.trim().length === 0);

module.exports = isEmpty;
