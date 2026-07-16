import { Injectable, Logger } from "@nestjs/common"; //Logger mostra os logs de execução no terminal
import { MentorRepository } from "../repository/mentor.repository";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class DeleteExpiredMentorsService {
    private readonly logger = new Logger(DeleteExpiredMentorsService.name);

    constructor(private readonly mentorRepository: MentorRepository) { }

    @Cron(CronExpression.EVERY_DAY_AT_3AM) // Executa a cada dia às 3 da manhã. Horário de baixa atividade
    async execute(): Promise<void> {
        this.logger.log('Iniciando a rotina de exclusão de contas expiradas...');

        try {
            await this.mentorRepository.findExpiredMentorsAndDelete();
            this.logger.log('Rotina de exclusão de contas expiradas concluída com sucesso.');
        } catch (error) {
            this.logger.error('Ocorreu um erro ao excluir contas expiradas:', error.stack);
        }
    }
}