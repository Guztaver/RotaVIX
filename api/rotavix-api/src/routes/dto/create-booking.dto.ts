import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCpf', async: false })
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const cpfNumbers = cpf.split('').map((el) => +el);
    const rest = (count: number) =>
      ((cpfNumbers.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;
    return rest(10) === cpfNumbers[9] && rest(11) === cpfNumbers[10];
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido';
  }
}

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  routeId: number;

  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidCpfConstraint)
  passengerDocument: string;

  @IsEmail()
  @IsNotEmpty()
  passengerEmail: string;

  @IsString()
  @IsNotEmpty()
  passengerPhone: string;

  @IsNumber()
  @Min(1)
  @Max(60)
  seatNumber: number;

  @IsOptional()
  @IsString()
  username?: string;
}
