import mongoose, { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UserDocument } from './user.schema';
import { userDTO } from './dto/user-dto';

export type UserModel = Model<User>;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async create(createContextDto: userDTO): Promise<UserDocument> {
    const createdUser = new this.userModel(createContextDto);
    return createdUser.save();
  }
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findOne(userid: number): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({ user_id: userid });

      if (!user) {
        return null;
        // throw new NotFoundException(`User with id ${userid} not found`);
      }
      return user;
    } catch (error) {
      console.log(error, ' IT WAS ERROR');
      throw new NotFoundException(`User with id ${userid} not found`);
    }
  }

  async update(
    _id: mongoose.Types.ObjectId,
    updateUserDTO: Partial<userDTO>,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        _id,
        { $set: updateUserDTO },
        { new: true },
      );

      if (!user) {
        return null;
        // throw new NotFoundException(`User with id ${userid} not found`);
      }

      return user;
    } catch (error) {
      console.log(error, ' IT WAS ERROR');
      throw new NotFoundException(`User with id ${_id} not found`);
    }
  }
}
