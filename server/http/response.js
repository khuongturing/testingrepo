const response = {
  success: (res, data) => res.status(200).json(data),
  created: (res, data) => res.status(201).json(data),
};

export default response;
