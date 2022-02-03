"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Pricings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      factory: {
        type: Sequelize.INTEGER,
        references: {
          model: "Factories",
        },
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
        },
      },
      pricingUSD: {
        type: Sequelize.STRING,
      },
      pricingLocal: {
        type: Sequelize.STRING,
      },
      USDFixedPrice: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),

      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Pricings");
  },
};
