import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  routeId: number;

  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsString()
  @IsNotEmpty()
  passengerDocument: string;

  @IsNumber()
  @Min(1)
  @Max(60)
  seatNumber: number;

  @IsOptional()
  @IsString()
  username?: string;
}
