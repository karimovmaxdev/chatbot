import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId || null,
    ref: 'Context',
    // validate: {
    //   validator: function (value: string | null) {
    //     return value === null || mongoose.Types.ObjectId.isValid(value);
    //   },
    //   message: 'Invalid ObjectId or null for current_context_id',
    // },
  })
  current_context_id: mongoose.Schema.Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
