import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './rating.model';
import { Model, Types } from 'mongoose';
import { MovieService } from 'src/movie/movie.service';
import { SetRatingDTO } from './dto/set-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private rating: Model<Rating>,
    private readonly movieService: MovieService,
  ) {}

  async getMovieValueByUser(
    movie: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<number> {
    return this.rating
      .findOne({ movie, user })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }

  async averageRatingByMovie(movie: Types.ObjectId | string): Promise<number> {
    const ratingsMovie: Rating[] = await this.rating
      .aggregate()
      .match({
        movie: new Types.ObjectId(movie),
      })
      .exec();

    return (
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingsMovie.length
    );
  }

  async setRating(user: Types.ObjectId, dto: SetRatingDTO) {
    const { movie, value } = dto;

    const newRating = await this.rating
      .findOneAndUpdate(
        { movie, user },
        { movie, user, value },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    const avrRating = await this.averageRatingByMovie(movie);

    await this.movieService.updateRating(movie, avrRating);

    return newRating;
  }
}
