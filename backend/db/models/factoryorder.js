"use strict";
module.exports = (sequelize, DataTypes) => {
  const FactoryOrder = sequelize.define(
    "FactoryOrder",
    {
      factoryPO: DataTypes.STRING,
      factory: DataTypes.INTEGER,
      customerOrder: DataTypes.INTEGER,
      costUSD: DataTypes.STRING,
      costLocal: DataTypes.STRING,
      status: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isShipped: DataTypes.BOOLEAN,
      isPending: DataTypes.BOOLEAN,
      orderDate: DataTypes.DATEONLY,
      shipByDate: DataTypes.DATEONLY,
      priority: DataTypes.STRING,
      notes: DataTypes.STRING,
      showFactoryPricing: DataTypes.BOOLEAN,
    },
    {}
  );
  FactoryOrder.associate = function (models) {
    // associations can be defined here
    FactoryOrder.belongsTo(models.Factory, { foreignKey: "factory" });
    FactoryOrder.belongsTo(models.CustomerOrder, {
      foreignKey: "customerOrder",
    });
    FactoryOrder.hasMany(models.LineItem, { foreignKey: "factoryOrder" });
  };
  return FactoryOrder;
};
