import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuestionAssignmentsService } from './question-assignments.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly questionAssignmentsService: QuestionAssignmentsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7PM)
  async handleCron() {
    this.logger.debug('Running daily question assignment update');

    const regions = ['Singapore', 'US']; // Add more regions as needed
    const cycleDuration = 7; // Duration in days

    for (const region of regions) {
      await this.updateQuestionAssignments(region, cycleDuration);
    }
  }

  private async updateQuestionAssignments(
    region: string,
    cycleDuration: number,
  ) {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      19,
      0,
      0,
    ); // 7 PM SGT

    const questions =
      await this.questionAssignmentsService.findQuestionsByRegion(region);
    if (!questions || questions.length === 0) {
      this.logger.warn(`No questions found for region ${region}`);
      return;
    }

    const cycleIndex =
      Math.floor(
        (currentDate.getTime() - startDate.getTime()) /
          (cycleDuration * 24 * 60 * 60 * 1000),
      ) % questions.length;
    const currentQuestion = questions[cycleIndex];
    const nextQuestion = questions[(cycleIndex + 1) % questions.length];

    await this.questionAssignmentsService.updateCurrentAssignment(
      region,
      currentQuestion,
    );
    await this.questionAssignmentsService.updateUpcomingAssignment(
      region,
      nextQuestion,
    );

    this.logger.debug(`Updated question assignments for region ${region}`);
  }
}
