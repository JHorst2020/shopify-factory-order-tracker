"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Files", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer: {
        type: Sequelize.INTEGER,
        references: {
          model: "CustomerOrders",
        },
      },
      fileName: {
        type: Sequelize.STRING,
      },
      fileContent: {
        type: Sequelize.STRING,
      },
      fileCategory: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      isSharedWithFactory: {
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
    return queryInterface.dropTable("Files");
  },
};
