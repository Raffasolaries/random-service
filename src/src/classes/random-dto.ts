import { IsNumber, IsOptional, IsInt, IsDefined, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RandomDto {
 @ApiProperty({
  type: Number,
  description: 'Total number to be distributed',
  required: true,
  minimum: 1
 })
 @IsDefined()
 @IsInt()
 @Min(1)
 total: number;

 @ApiProperty({
  type: Number,
  description: 'Number of clusters on which distribute the total',
  required: true,
  minimum: 1
 })
 @IsDefined()
 @IsInt()
 @Min(1)
 clusters: number;

 @ApiProperty({
  type: Number,
  description: 'Number of clusters on which distribute the total',
  required: false
 })
 @IsOptional()
 @IsNumber()
 minPercentage?: number;
}
