import mongoose from 'mongoose';

export class userDTO {
  user_id: number;
  username: string;
  current_context_id: mongoose.Types.ObjectId | null;
}
