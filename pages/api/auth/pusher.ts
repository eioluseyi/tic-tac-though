import { ChannelAuthResponse } from "pusher";
import { pusher } from "../../../lib";
// import { v4 as user_id } from "uuid";

export default async function handler(
  req: { body: { socket_id: any; channel_name: any; username: any } },
  res: { send: (arg0: ChannelAuthResponse) => void }
) {
  const { socket_id, channel_name, username } = req.body;

  const presenceData = {
    user_id: Math.random().toString(36).slice(2),
    user_info: {
      username
    }
  };

  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);
  } catch (error) {
    console.error(error);
  }
}
