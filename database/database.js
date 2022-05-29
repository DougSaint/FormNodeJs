const Sequelize = require("sequelize");

const connection = new Sequelize('myblog','root','password',{
	host: 'localhost',
	dialect: 'mysql',
	timezone:"-03:00"
});

module.exports = connection

