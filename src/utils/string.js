export const capitalize = (word) => {
  if (typeof word !== "string" || word.length === 0) {
    return "";
  }
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};
