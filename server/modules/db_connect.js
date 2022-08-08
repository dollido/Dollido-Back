import mysql from "mysql2/promise";
import info from "../config/db_info";

let pool = mysql.createPool(info);

const queryGet = async (query, args=[]) => {
	try {
		const connection = await pool.getConnection(async conn => conn);
		try {
			const [rows] = await connection.query(query, args);
            connection.release();
			return rows;
		} catch(err) {
			connection.release();
			return false;
		}
	} catch(err) {
		return false;
	}
};

module.exports = queryGet;