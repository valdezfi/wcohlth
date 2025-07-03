import { StreamChat } from 'stream-chat';

let client: StreamChat | null = null;

export function getStreamClient() {
  if (!client) {
    if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
      throw new Error('Missing NEXT_PUBLIC_STREAM_API_KEY env variable');
    }
    client = new StreamChat(process.env.NEXT_PUBLIC_STREAM_API_KEY);
  }
  return client;
}
