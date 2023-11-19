import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ContextDocument = mongoose.HydratedDocument<Context>;

@Schema()
export class Context {
  @Prop({ required: true })
  generating: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ required: false })
  message: string | null;
}

export const ContexSchema = SchemaFactory.createForClass(Context);
