import { Document, Schema as MongoSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.model';
import { Movie } from 'src/movie/movie.model';

@Schema()
export class Rating extends Document {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Movie' })
  movie: Movie;

  @Prop({ required: true })
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
