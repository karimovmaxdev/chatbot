import mongoose, { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Context, ContextDocument } from './context.schema';
import { contextDTO } from './dto/context-dto';

type ContextModel = Model<Context>;

@Injectable()
export class ContextService {
  constructor(@InjectModel(Context.name) private contextModel: ContextModel) {}

  async create(createContextDto: contextDTO): Promise<ContextDocument> {
    const createdContext = new this.contextModel(createContextDto);
    return createdContext.save();
  }

  async findAllByUserId(
    _id: mongoose.Types.ObjectId,
  ): Promise<ContextDocument[]> {
    return await this.contextModel.find({ user_id: _id });
  }

  async findByStringId(_id: string) {
    const context = await this.contextModel.findOne({ _id });
    return context;
  }

  async findById(
    _id: mongoose.Schema.Types.ObjectId,
  ): Promise<ContextDocument | null> {
    try {
      const context = await this.contextModel.findById(_id);
      if (!context) {
        return undefined;
        // throw new NotFoundException(`Context with id ${_id} not found`);
      }
      return context;
    } catch (error) {
      // throw new NotFoundException(`Context with id ${userid} not found`);
      console.log(error, ' IT WAS ERROR');
    }
  }

  async update(
    _id: mongoose.Types.ObjectId,
    updateContextDTO: Partial<contextDTO>,
  ): Promise<ContextDocument | null> {
    try {
      const context = await this.contextModel
        .findByIdAndUpdate(_id, { $set: updateContextDTO }, { new: true })
        .exec();

      if (!context) {
        return null;
        // throw new NotFoundException(`context with id ${contextid} not found`);
      }

      return context;
    } catch (error) {
      console.log(error, ' IT WAS ERROR');
      throw new NotFoundException(`Context with id ${_id} not found`);
    }
  }
}
