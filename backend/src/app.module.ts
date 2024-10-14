import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsModule } from './questions/questions.module';
import { QuestionAssignmentsModule } from './question-assignments/question-assignments.module';
import { CronService } from './question-assignments/cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule available application-wide
      envFilePath: '.env', // specify the path to the .env file
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    QuestionsModule,
    QuestionAssignmentsModule,
  ],
  providers: [CronService],
})
export class AppModule {}
