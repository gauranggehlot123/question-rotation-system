import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuestionAssignmentsService } from './question-assignments.service';
import { QuestionAssignment } from './questionAssignment.schema';
import { Question } from '../questions/question.schema';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly questionAssignmentsService: QuestionAssignmentsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Running question assignment update');
    await this.updateQuestionAssignments();
  }

  private async updateQuestionAssignments() {
    try {
      const currentAssignments = await this.questionAssignmentsService.getCurrentAssignments();
      const upcomingAssignments = await this.questionAssignmentsService.getUpcomingAssignments();

      const now = new Date();

      for (const assignment of currentAssignments) {
        const endDate = new Date(assignment.startDate);
        endDate.setDate(endDate.getDate() + assignment.duration);

        if (now > endDate) {
          // Current assignment has expired
          await this.questionAssignmentsService.update(assignment._id.toString(), { isActive: false });
          this.logger.debug(`Deactivated expired assignment: ${assignment._id}`);

          // Find the next assignment for this region
          const nextAssignment = upcomingAssignments.find(
            (upcoming) => upcoming.question.region === assignment.question.region
          );

          if (nextAssignment) {
            // Activate the next assignment
            await this.questionAssignmentsService.update(nextAssignment._id.toString(), {
              isActive: true,
              startDate: now
            });
            this.logger.debug(`Activated next assignment for ${assignment.question.region}: ${nextAssignment._id}`);
          } else {
            this.logger.warn(`No upcoming assignment found for region: ${assignment.question.region}`);
          }
        }
      }

      // Check if any region is missing a current assignment
      const regions = [...new Set([...currentAssignments, ...upcomingAssignments].map(a => a.question.region))];
      for (const region of regions) {
        const hasCurrentAssignment = currentAssignments.some(a => a.question.region === region);
        if (!hasCurrentAssignment) {
          const nextAssignment = upcomingAssignments.find(a => a.question.region === region);
          if (nextAssignment) {
            await this.questionAssignmentsService.update(nextAssignment._id.toString(), {
              isActive: true,
              startDate: now
            });
            this.logger.debug(`Activated new current assignment for ${region}: ${nextAssignment._id}`);
          } else {
            this.logger.warn(`No assignment available for region: ${region}`);
          }
        }
      }

      this.logger.debug('Completed question assignment update');
    } catch (error) {
      this.logger.error('Error updating question assignments:', error);
    }
  }
}