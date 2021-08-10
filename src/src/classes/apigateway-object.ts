import { IsNumber, IsOptional, IsInt, IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HeadersDto {
 @IsOptional()
 @IsString()
 'Content-Type': string;
}

export class ApigatewayObject {
 @IsDefined()
 @IsInt()
 statusCode: number;

 @IsDefined()
 @ValidateNested()
	@Type(() => HeadersDto)
 headers: HeadersDto;

 @IsDefined()
 @IsString()
 body: string;
}
