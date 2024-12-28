import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { UserRepository } from './user.repository.interface';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ userName }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  private toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc.userName,
      userDoc.nickName,
      userDoc.email,
      userDoc.firstName,
      userDoc.lastName,
    );
  }
}
