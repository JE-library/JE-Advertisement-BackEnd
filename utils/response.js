const successResponse = (username, message, data) => {
  const response = {
    success: true,
    username,
    message: message,
    data: data,
    error: null,
  };

  return response;
};

const errorResponse = (username, message, data, error) => {
  const response = {
    success: false,
    username,
    message: message,
    data: data,
    error: error,
  };
  return response;
};

module.exports = { errorResponse, successResponse };
