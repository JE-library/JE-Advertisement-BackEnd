const successResponse = (message, data) => {
  const response = {
    success: true,
    message: message,
    data: data,
    error: null,
  };

  return response;
};

const errorResponse = (message, data, error) => {
  const response = {
    success: false,
    message: message,
    data: data,
    error: error,
  };
  return response;
};

module.exports = { errorResponse, successResponse };
