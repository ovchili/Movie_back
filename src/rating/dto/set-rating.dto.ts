import { IsNumber, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class SetRatingDTO {
  movie: Types.ObjectId;

  @Min(1, {
    message: 'Значение рейтинга не может быть меньше 1',
  })
  @Max(10, {
    message: 'Значение рейтинга не может быть больше 10',
  })
  @IsNumber({}, { message: 'Укажите цифру' })
  value: number;
}
