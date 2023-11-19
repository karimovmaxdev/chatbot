import mongoose from 'mongoose';

export class contextDTO {
  // context_id: number;
  generating: boolean;
  user_id: mongoose.Types.ObjectId;
  message: string | null;
}
