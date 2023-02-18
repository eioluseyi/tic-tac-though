import Pusher from "pusher";

export const pusher = new Pusher({
  app_id: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: process.env.useTLS
});
