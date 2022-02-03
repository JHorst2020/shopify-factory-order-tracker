"use strict";
module.exports = (sequelize, DataTypes) => {
  const Factory = sequelize.define(
    "Factory",
    {
      contactInfo: DataTypes.INTEGER,
      name: DataTypes.STRING,
      currency: DataTypes.STRING,
    },
    {}
  );
  Factory.associate = function (models) {
    // associations can be defined here
    Factory.hasMany(models.Pricing, { foreignKey: "factory" });
    Factory.hasMany(models.FactoryOrder, { foreignKey: "factory" });
    Factory.belongsTo(models.ContactInfo, { foreignKey: "contactInfo" });
  };
  return Factory;
};
