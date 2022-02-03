"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("LineItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      item: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
        },
      },
      factoryOrder: {
        type: Sequelize.INTEGER,
        references: {
          model: "FactoryOrders",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      xs: {
        type: Sequelize.INTEGER,
      },
      s: {
        type: Sequelize.INTEGER,
      },
      m: {
        type: Sequelize.INTEGER,
      },
      l: {
        type: Sequelize.INTEGER,
      },
      xl: {
        type: Sequelize.INTEGER,
      },
      shopifyId: {
        type: Sequelize.STRING,
      },
      internalNotes: {
        type: Sequelize.STRING,
      },
      factoryNotes: {
        type: Sequelize.STRING,
      },
      quantityFulfilled: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      unitCostUSD: {
        type: Sequelize.STRING,
      },
      unitCostLocal: {
        type: Sequelize.STRING,
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
      },
      isShipped: {
        type: Sequelize.BOOLEAN,
      },
      isActive: {
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
    return queryInterface.dropTable("LineItems");
  },
};
