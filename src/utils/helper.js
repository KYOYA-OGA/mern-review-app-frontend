export const isValidEmail = (email) => {
  // eslint-disable-next-line
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return isValid.test(email);
};
