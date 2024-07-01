import { promises } from "dns";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import {User} from './Index'

// Define the attributes and their types
interface ChatAttributes {
  id: number;
}

// For creation, id is optional since it's auto-incremented
interface ChatCreationAttributes extends Optional<ChatAttributes, 'id'> {}

// Define the model class
class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addUsers!:(users:any[] )=>Promise<void>;
  public addMessage!: (message:any ) => Promise<void>;
}

export default  (db: Sequelize) => {
  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  }, {
    sequelize: db, // passing the `sequelize` instance is required
    modelName: 'Chat',
    timestamps: true,
  });

  return Chat;
};
