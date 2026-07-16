import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FormValuesDeleteAccount {
    
    @IsNotEmpty()
    @IsString()
    reasonOption: string

    @IsOptional()
    @IsString()
    reasonText: string

    @IsNotEmpty()
    @IsString()
    usabilityRating: string

    @IsNotEmpty()
    @IsString()
    satisfactionRating: string

    @IsOptional()
    @IsString()
    userExperienceFeedback: string
}