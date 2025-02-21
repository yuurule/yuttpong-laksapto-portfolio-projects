import { Response } from 'express'; 

export const sendResponse = (
  res : Response, 
  status : number, 
  message : string,
  data : Object | null = null) => {
  const response = {
    MESSAGE: message,
    ...(data && { RESULT_DATA: data })
  };
  return res.status(status).json(response);
};

export const sendError = (
  res : Response, 
  status : number, 
  message : string,
) => {
  return res.status(status).json({ MESSAGE: `${message}` });
};