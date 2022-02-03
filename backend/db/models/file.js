"use strict";
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      customer: DataTypes.INTEGER,
      fileName: DataTypes.STRING,
      fileContent: DataTypes.STRING,
      fileCategory: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isSharedWithFactory: DataTypes.BOOLEAN,
    },
    {}
  );
  File.associate = function (models) {
    // associations can be defined here
    File.belongsTo(models.CustomerOrder, { foreignKey: "customer" });
  };
  return File;
};
