'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactInfo = sequelize.define('ContactInfo', {
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    address3: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  ContactInfo.associate = function(models) {
    // associations can be defined here
    ContactInfo.hasMany(models.Factory,{foreignKey:"contactInfo"})
    ContactInfo.hasMany(models.CustomerOrder,{foreignKey:"shipToAddress"})
  };
  return ContactInfo;
};