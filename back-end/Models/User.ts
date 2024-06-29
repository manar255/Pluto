import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Define the attributes and their types
interface UserAttributes {
  id: number;
  fName: string;
  lName: string;
  userName: string;
  password: string;
  imageUrl:string;
  
}

// For creation, id is optional since it's auto-incremented
interface UserCreationAttributes extends Optional<UserAttributes, 'id' > {}

// Define the model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public fName!: string;
  public lName!: string;
  public userName!: string;
  public password!: string;
  public imageUrl!: string;
  

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (db: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name:'validation error',
        msg: 'userName already exists',
      },  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
     }
  }, {
    sequelize: db, // passing the `sequelize` instance is required
    modelName: 'User',
    timestamps: true,
  });

  return User;
};
