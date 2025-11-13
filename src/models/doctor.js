import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "doctor_name",
      validate: {
        notEmpty: true,
      },
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hospital: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "experience_years",
      validate: {
        min: 0,
      },
    },
    consultationFee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "consultation_fee",
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availability: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preferredDoctor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "preferred_doctor",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "updated_by",
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Doctor;
