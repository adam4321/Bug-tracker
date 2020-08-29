/**********************************************************
**  Description:  MySql database configuration
**********************************************************/

const credentials = require('./credentials.js');

const mysql = require('mysql');

const config = {
	connectionLimit :  100,
	user            :  credentials.LOCAL_USER,
	password        :  credentials.LOCAL_PASSWORD,
    host            :  credentials.LOCAL_HOSTNAME,
    database        :  credentials.LOCAL_DB,
    port            :  3306,
    dateStrings     :  'true',
};

let pool = mysql.createPool(config);

module.exports.pool = pool;