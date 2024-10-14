import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './question.schema';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() question: Partial<Question>): Promise<Question> {
    return this.questionsService.create(question);
  }

  @Get()
  findAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() question: Partial<Question>): Promise<Question> {
    return this.questionsService.update(id, question);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Question> {
      console.log("id",id)
    return this.questionsService.remove(id);
  }
}
