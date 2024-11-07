import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/service/prisma.service";
import { CreateCalendlyInfoDto, UpdateCalendlyInfoDto } from "../dto/calendly-info-dto";

@Injectable()
export class CalendlyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCalendlyMentorInfos() {
    return this.prisma.calendlyInfo.findMany()
  }

  async createCalendlyInfo(
    data: CreateCalendlyInfoDto,
    mentorId: string
  ) {
    Object.assign(data, {
        mentorId,
      });

    return this.prisma.calendlyInfo.create({
      data
    });
  }

  async updateCalendlyInfo(
    mentorId: string,
    updateCalendlyInfoDto: UpdateCalendlyInfoDto,
  ) {
    return this.prisma.calendlyInfo.update({
      where: { mentorId },
      data: updateCalendlyInfoDto,
    });
  }

  async getCalendlyInfoByMentorId(mentorId: string) {
    return this.prisma.calendlyInfo.findUnique({
      where: { mentorId },
    });
  }
}
