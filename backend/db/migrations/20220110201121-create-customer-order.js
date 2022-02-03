"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CustomerOrders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shopifyId: {
        type: Sequelize.STRING,
      },
      shopifyCustomerId: {
        type: Sequelize.STRING,
      },
      shopifyOrderNumber: {
        type: Sequelize.STRING,
      },
     customerFirstName: {
        type: Sequelize.STRING,
      },
      customerLastName: {
        type: Sequelize.STRING,
      },
      orderDate: {
        type: Sequelize.DATEONLY,
      },
      shipToCustomer: {
        type: Sequelize.BOOLEAN,
      },
      shipToAddress: {
        type: Sequelize.INTEGER,
        references: {
          model: "ContactInfos",
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      isCancelled: {
        type: Sequelize.BOOLEAN,
      },
      isReceived: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.STRING,
      },
      requireApproval: {
        type: Sequelize.BOOLEAN,
      },
      approvalBy: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
        },
      },
      approvalBySecondary: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
        },
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
    return queryInterface.dropTable("CustomerOrders");
  },
};
