"use strict";
module.exports = (sequelize, DataTypes) => {
  const Pricing = sequelize.define(
    "Pricing",
    {
      factory: DataTypes.INTEGER,
      category: DataTypes.INTEGER,
      pricingUSD: DataTypes.STRING,
      pricingLocal: DataTypes.STRING,
      USDFixedPrice: DataTypes.BOOLEAN,
    },
    {}
  );
  Pricing.associate = function (models) {
    // associations can be defined here
    Pricing.belongsTo(models.Category, { foreignKey: "category" });
    Pricing.belongsTo(models.Factory, { foreignKey: "factory" });
  };
  return Pricing;
};
