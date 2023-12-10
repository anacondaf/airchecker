const catchAsync = (fn) => async (req, res, next) => {
  // Promise.resolve().catch((err) => {
  //   next(err);
  // });

  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = catchAsync;