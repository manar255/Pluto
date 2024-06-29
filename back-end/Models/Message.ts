import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Define the attributes and their types
interface MessageAttributes {
  id: number;
  content:string;
}

// For creation, id is optional since it's auto-incremented
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

// Define the model class
class Message extends Model<MessageAttributes,MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (db: Sequelize) => {
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: DataTypes.STRING,
  }, {
    sequelize: db, // passing the `sequelize` instance is required
    modelName: 'Message',
    timestamps: true,
  });

  return Message;
};
