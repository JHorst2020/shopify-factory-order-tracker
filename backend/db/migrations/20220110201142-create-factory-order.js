"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("FactoryOrders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      factoryPO: {
        type: Sequelize.STRING,
      },
      factory: {
        type: Sequelize.INTEGER,
        references: {
          model: "Factories",
        },
      },
      customerOrder: {
        type: Sequelize.INTEGER,
        references: {
          model: "CustomerOrders",
        },
      },
      costUSD: {
        type: Sequelize.STRING,
      },
      costLocal: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      isShipped: {
        type: Sequelize.BOOLEAN,
      },
      isPending: {
        type: Sequelize.BOOLEAN,
      },
      orderDate: {
        type: Sequelize.DATEONLY,
      },
      shipByDate: {
        type: Sequelize.DATEONLY,
      },
      priority: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      showFactoryPricing: {
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
    return queryInterface.dropTable("FactoryOrders");
  },
};
