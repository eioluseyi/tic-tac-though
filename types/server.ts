export type RequestResponseType = {
  data: object;
  message: string;
  success: boolean;
};

export type CallbackType = (arg0: RequestResponseType) => void;
