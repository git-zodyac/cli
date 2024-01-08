// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface String {
  capitalize(): string;
  camelCase(): string;
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCase = function () {
  const parts = this.split(" ");
  const capitalized = parts.map((part) => part.capitalize());
  return capitalized.join("");
};
