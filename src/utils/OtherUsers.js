export const excludeUserById = (excludeId, users) => {
  const arrayFinal = users.filter(user => user._id !== excludeId);
  return arrayFinal;
};
