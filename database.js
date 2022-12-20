// if (process.env.NODE_ENV !== 'produuction') {
// 	require('dotenv').config()
// }

const mysql = require('mysql') //require('mysql');
mysql.createConnection({ multipleStatements: true });
//* DATABASE NAME HERE
// const createDB = require('./createDB')

//* CREATES DATABASE FROM createDB.js 
// createDB.setDB()

//* GET DB name
// const db = createDB.name()

// const con = mysql.createConnection({
// 	host: 'localhost',
// 	database: `${db}`,
// 	user: 'root',
// 	password: ''
// })

const id_n_chars = 50

const con = mysql.createPool({ //createConnection
	host: 'sql.freedb.tech',
	database: `freedb_CemboDB`,
	user: 'freedb_arolatenci',
	password: 'UV9u2t2qt%je6%s',
	port: 3306
})

con.getConnection(function (error, connection) { //con.connect
	if (error) {
		throw error;
	}
	else {
		const setUTF = `SET NAMES 'utf8mb4' COLLATE 'utf8mb4_general_ci';`

		//* USER TABLES START
		const user_info = `
		CREATE TABLE IF NOT EXISTS user_info (	
		id 						VARCHAR(${id_n_chars}) PRIMARY KEY, 				
		isActive 			BOOLEAN,
		first_name   	VARCHAR(50), 							
		role   				VARCHAR(20), 							
		last_name    	VARCHAR(30), 							
		middle_name  	VARCHAR(30), 							
		password     	VARCHAR(100), 							
		gender       	VARCHAR(20), 							
		dob			 			DATE, 							
		age			 			TINYINT, 							
		pob			 			VARCHAR(100), 							
		civil_status 	VARCHAR(20), 							
		religion			VARCHAR(50)	
		)`

		const contact_info = `
		CREATE TABLE IF NOT EXISTS contact_info (	
		user_id 						VARCHAR(${id_n_chars}),			   					
		contact_number 			VARCHAR(100),			   					
		email_address 			VARCHAR(50), 			   					
		physical_address 		VARCHAR(100),								
		province 						VARCHAR(30),								
		provincial_address 	VARCHAR(100),								
		FOREIGN KEY (user_id) REFERENCES user_info(id)					
		)`

		const makati_info = `
		CREATE TABLE IF NOT EXISTS makati_info (	
		user_id 				VARCHAR(${id_n_chars}),								
		isVoter 				BOOLEAN NOT NULL,									
		isVaccinated 		VARCHAR(20),								
		isHead 					BOOLEAN,											
		relationship 		VARCHAR(20),									
		social_sector 	VARCHAR(20),									
		len_stay_makati TINYINT,									
		len_stay_cembo 	TINYINT,										
		len_stay_curr 	TINYINT,										
		FOREIGN KEY (user_id) REFERENCES user_info(id)				
		)`

		const household_info = `
		CREATE TABLE IF NOT EXISTS household_info (	\
		head_id 						INTEGER(${id_n_chars}) AUTO_INCREMENT PRIMARY KEY,
		user_id 						VARCHAR(${id_n_chars}),							
		household 					TINYINT, 			   							
		families_household 	TINYINT,														
		family_members 			TINYINT,									
		FOREIGN KEY (user_id) REFERENCES user_info(id)
		)`

		const makati_cards = `
		CREATE TABLE IF NOT EXISTS makati_cards (	
		user_id 		VARCHAR(${id_n_chars}),			   					
		yellow 			BOOLEAN NOT NULL,			   					
		blue 				BOOLEAN NOT NULL,			   						
		white 			BOOLEAN NOT NULL,			   						
		philhealth 	BOOLEAN NOT NULL,			   					
		makatizen 	BOOLEAN NOT NULL,			   						
		FOREIGN KEY (user_id) REFERENCES user_info(id)					
		)`

		const income_info = `
		CREATE TABLE IF NOT EXISTS income_info (	
		user_id 					VARCHAR(${id_n_chars}),			   					
		educ 							VARCHAR(10),			   								
		monthly_income 		INTEGER,			   							
		monthly_expenses 	MEDIUMINT,			   						
		monthly_netIncome MEDIUMINT,			   					
		mean_income 			MEDIUMINT,			   							
		FOREIGN KEY (user_id) REFERENCES user_info(id)				
		)`

		//* USER TABLES END

		const officials = `
		CREATE TABLE IF NOT EXISTS officials (
		id 				INTEGER(${id_n_chars}) UNIQUE, 
		position 	VARCHAR(30), 
		name 			VARCHAR(50), 
		image 		LONGTEXT
		)`

		const posts = `
		CREATE TABLE IF NOT EXISTS posts (
		id INTEGER(100) AUTO_INCREMENT PRIMARY KEY, 
		title VARCHAR(100), 
		body VARCHAR(1000), 
		date VARCHAR(10), 
		time VARCHAR(10), 
		image LONGTEXT
		);`

		const setFKChecks = `
		SET GLOBAL FOREIGN_KEY_CHECKS=0;
		`

		const user_messages = `
		CREATE TABLE IF NOT EXISTS user_messages (
		id INTEGER(100) AUTO_INCREMENT PRIMARY KEY, 
		email VARCHAR(50), 
		body VARCHAR(1000), 
		date VARCHAR(10), 
		time VARCHAR(10)
		);`

		//^ SET QUERIES
		con.query(user_info, function (err, result) {
			if (err) throw err
		})

		con.query(contact_info, function (err, result) {
			if (err) throw err
		})

		con.query(makati_info, function (err, result) {
			if (err) throw err
		})

		con.query(household_info, function (err, result) {
			if (err) throw err
		})

		con.query(makati_cards, function (err, result) {
			if (err) throw err
		})

		con.query(income_info, function (err, result) {
			if (err) throw err
		})

		// con.query(setFKChecks, function (err, result) {
		// 	if (err) throw err
		// })

		con.query(user_messages, function (err, result) {
			if (err) throw err
		})

		//* BRGY OFFICIALS
		con.query(officials, function (err, result) {
			if (err) throw err
		})

		con.query(setUTF, function (err, result) {
			if (err) throw err
		})

		//* REGISTER END
		con.query(posts, function (err, result) {
			// if (err) done(err)
			if (err) throw err
			console.log('Tables created Successfully!')
		})
	}
})

module.exports = con