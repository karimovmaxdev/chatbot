import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContextService } from './context.service';
import { Context, ContexSchema } from './context.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Context.name, schema: ContexSchema }]),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContexModule {}
