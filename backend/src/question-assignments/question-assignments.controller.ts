import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { QuestionAssignmentsService } from './question-assignments.service';
import { QuestionAssignment } from './questionAssignment.schema';

@Controller('question-assignments')
export class QuestionAssignmentsController {
  constructor(private readonly questionAssignmentsService: QuestionAssignmentsService) {}

  // Get current question assignments for all regions
  @Get('current-assignments')
  async getCurrentAssignments() {
    return this.questionAssignmentsService.getCurrentAssignments();
  }

    // Get current question assignments for all regions
    @Get('upcoming-assignments')
    async getUpcomingAssignments() {
      return this.questionAssignmentsService.getUpcomingAssignments();
    }


  // Get all Question Assignments with their associated question data
  @Get('with-questions')
  async findAllWithQuestions(): Promise<QuestionAssignment[]> {
    return this.questionAssignmentsService.findAllWithQuestions();
  }

  // Create a new Question with Assignment
  @Post('create')
  async createQuestionWithAssignment(
    @Body() createQuestionDto: { content: string; region: string; duration: number; }
  ): Promise<QuestionAssignment> {
    const { content, region, duration } = createQuestionDto;
    return this.questionAssignmentsService.createQuestionWithAssignment({ content, region, isActive: true }, duration);
  }


  // Create a new Question Assignment
  @Post()
  async create(@Body() createQuestionAssignmentDto: Partial<QuestionAssignment>): Promise<QuestionAssignment> {
    return this.questionAssignmentsService.create(createQuestionAssignmentDto);
  }


  // Get all Question Assignments
  @Get()
  async findAll(): Promise<QuestionAssignment[]> {
    return this.questionAssignmentsService.findAll();
  }

  // Get a single Question Assignment by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QuestionAssignment> {
    return this.questionAssignmentsService.findOne(id);
  }

  // Update a Question Assignment by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionAssignmentDto: Partial<QuestionAssignment>
  ): Promise<QuestionAssignment> {
    return this.questionAssignmentsService.update(id, updateQuestionAssignmentDto);
  }

  // Delete a Question Assignment by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<QuestionAssignment> {
    return this.questionAssignmentsService.remove(id);
  }

}
