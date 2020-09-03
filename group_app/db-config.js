/**********************************************************
**  Description:  MySql database configuration
**********************************************************/

const credentials = require('./LOCAL-credentials.js');

const mysql = require('mysql');

const config = {
	connectionLimit :  100,
	user            :  credentials.USER,
	password        :  credentials.PASSWORD,
    host            :  credentials.HOSTNAME,
    database        :  credentials.DB,
    port            :  3306,
    dateStrings     :  'true',
    multipleStatements: true
};

let pool = mysql.createPool(config);

module.exports.pool = pool;
