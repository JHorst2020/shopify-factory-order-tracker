"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      item: DataTypes.STRING,
      itemFamily: DataTypes.STRING,
      itemName: DataTypes.STRING,
      xs: DataTypes.BOOLEAN,
      s: DataTypes.BOOLEAN,
      m: DataTypes.BOOLEAN,
      l: DataTypes.BOOLEAN,
      xl: DataTypes.BOOLEAN,
      category: DataTypes.INTEGER,
    },
    {}
  );
  Product.associate = function (models) {
    // associations can be defined here
    Product.hasMany(models.LineItem, { foreignKey: "item" });
    Product.belongsTo(models.Category, { foreignKey: "category" });
  };
  return Product;
};
