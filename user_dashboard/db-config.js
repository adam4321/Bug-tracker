/**********************************************************
**  Description:  MySql database configuration
**********************************************************/

const credentials = require('./credentials.js');

const mysql = require('mysql');

const hostwinds = {
	connectionLimit : 10,
    host            :  credentials.local_HOSTNAME,
	user            :  credentials.local_USER,
	password        :  credentials.local_PASSWORD,
    database        :  credentials.local_DB,
    port            :  3306,
    dateStrings     :  'true',
};

let pool = mysql.createPool(hostwinds);

module.exports.pool = pool;