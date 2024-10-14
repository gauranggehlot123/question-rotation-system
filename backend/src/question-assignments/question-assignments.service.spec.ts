import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAssignmentsService } from './question-assignments.service';

describe('QuestionAssignmentsService', () => {
  let service: QuestionAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionAssignmentsService],
    }).compile();

    service = module.get<QuestionAssignmentsService>(QuestionAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
