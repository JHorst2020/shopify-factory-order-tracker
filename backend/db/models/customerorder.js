"use strict";
module.exports = (sequelize, DataTypes) => {
  const CustomerOrder = sequelize.define(
    "CustomerOrder",
    {
      shopifyId: DataTypes.STRING,
      shopifyOrderNumber: DataTypes.STRING,
      shopifyCustomerId: DataTypes.STRING,
      customerFirstName: DataTypes.STRING,
      customerLastName: DataTypes.STRING,
      orderDate: DataTypes.DATEONLY,
      shipToCustomer: DataTypes.BOOLEAN,
      shipToAddress: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
      isCancelled: DataTypes.BOOLEAN,
      isReceived: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
      requireApproval: DataTypes.BOOLEAN,
      approvalBy: DataTypes.INTEGER,
      approvalBySecondary: DataTypes.INTEGER,
    },
    {}
  );
  CustomerOrder.associate = function (models) {
    // associations can be defined here
    CustomerOrder.hasMany(models.FactoryOrder, { foreignKey: "customerOrder" });
    CustomerOrder.hasMany(models.File, { foreignKey: "customer" });
    CustomerOrder.belongsTo(models.User, { foreignKey: "approvalBy" });
    CustomerOrder.belongsTo(models.User, { foreignKey: "approvalBySecondary" });
    CustomerOrder.belongsTo(models.ContactInfo, { foreignKey: "shipToAddress" });
  };
  return CustomerOrder;
};
