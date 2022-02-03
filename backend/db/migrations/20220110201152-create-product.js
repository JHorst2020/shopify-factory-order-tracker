"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itemFamily: {
        type: Sequelize.STRING,
      },
      itemName: {
        type: Sequelize.STRING,
      },
      item: {
        type: Sequelize.STRING,
      },
      xs: {
        type: Sequelize.BOOLEAN,
      },
      s: {
        type: Sequelize.BOOLEAN,
      },
      m: {
        type: Sequelize.BOOLEAN,
      },
      l: {
        type: Sequelize.BOOLEAN,
      },
      xl: {
        type: Sequelize.BOOLEAN,
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
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
    return queryInterface.dropTable("Products");
  },
};
