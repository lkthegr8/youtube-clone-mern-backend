const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

/*
Explainnation of above code:(not understood yet)

const asyncHandler = (requestHandler) => (req, res, next) => { // requestHandler is a function whichis being taken as a input
  return (req, res, next) => { // returning a function 
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // calling the requestHandler/input function from parameter which has been wrapped inside a promise
  };
};
*/

export { asyncHandler };

/*
// below is a higher order function
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};
*/
