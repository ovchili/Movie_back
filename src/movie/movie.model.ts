import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema, Document } from 'mongoose';
import { User } from 'src/user/user.model';

@Schema({ timestamps: true, _id: true })
export class Movie extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
