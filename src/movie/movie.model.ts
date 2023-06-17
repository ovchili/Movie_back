import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MovieModel {
  @Prop()
  name: string;
  @Prop()
  description: string;
}

export const MovieSchema = SchemaFactory.createForClass(MovieModel);
