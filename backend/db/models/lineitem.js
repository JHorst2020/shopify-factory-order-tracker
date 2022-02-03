"use strict";
module.exports = (sequelize, DataTypes) => {
  const LineItem = sequelize.define(
    "LineItem",
    {
      item: DataTypes.INTEGER,
      factoryOrder: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      xs: DataTypes.INTEGER,
      s: DataTypes.INTEGER,
      m: DataTypes.INTEGER,
      l: DataTypes.INTEGER,
      xl: DataTypes.INTEGER,
      shopifyId: DataTypes.STRING,
      internalNotes: DataTypes.STRING,
      factoryNotes: DataTypes.STRING,
      quantityFulfilled: DataTypes.INTEGER,
      status: DataTypes.STRING,
      isCompleted: DataTypes.BOOLEAN,
      isShipped: DataTypes.BOOLEAN,
      isActive: DataTypes.BOOLEAN,
      unitCostUSD: DataTypes.STRING,
      unitCostLocal: DataTypes.STRING,
    },
    {}
  );
  LineItem.associate = function (models) {
    // associations can be defined here
    LineItem.belongsTo(models.Product, { foreignKey: "item" });
    LineItem.belongsTo(models.FactoryOrder, { foreignKey: "factoryOrder" });
  };
  return LineItem;
};
