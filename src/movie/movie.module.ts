import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

import { MongooseModule } from '@nestjs/mongoose';

import { MovieModel, MovieSchema } from './movie.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MovieModel.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}