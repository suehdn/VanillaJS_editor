export const executeWithTryCatch = async (asyncFunction, errorMessage) => {
  try {
    await asyncFunction();
  } catch (error) {
    console.error(errorMessage, error);
  }
};
