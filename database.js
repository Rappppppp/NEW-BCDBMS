if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const mysql = require('mysql') 
mysql.createConnection({ multipleStatements: true });

const con = mysql.createConnection({
	host: '',
	database: `BCDBMS`,
	user: 'root',
	password: ''
})

const id_n_chars = 50

// const con = mysql.createPool({ //createPool
// 	host: 'sql.freedb.tech',
// 	database: `freedb_CemboDB`,
// 	user: 'freedb_arolatenci',
// 	password: '5yYuaPN*&x49j5Z',
// 	port: 3306,
// 	charset: "utf8mb4"
// })

// const con = mysql.createPool({ //createConnection
// 	host: process.env.DB_HOST,
// 	database: `freedb_CemboDB`,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	port: process.env.PORT,
// })

con.connect(function (error, connection) { //con.getConnection - con.connect
	if (error) {
		throw error;
	}
	else {

		//* USER TABLES START
		const user_info = `
		CREATE TABLE IF NOT EXISTS user_info (	
		id 						VARCHAR(${id_n_chars}) PRIMARY KEY, 
		role   				VARCHAR(20),				
		isActive 			BOOLEAN,
		first_name   	VARCHAR(50), 							 							
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
		CREATE TABLE IF NOT EXISTS household_info (
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
		yellow 			BOOLEAN,			   					
		blue 				BOOLEAN,			   						
		white 			BOOLEAN,			   						
		philhealth 	BOOLEAN,			   					
		makatizen 	BOOLEAN,			   						
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
		id 				VARCHAR(${id_n_chars}) PRIMARY KEY,
		position 	VARCHAR(30), 
		name 			VARCHAR(50),
		image 		LONGTEXT
		)`

		const carousel = `
		CREATE TABLE IF NOT EXISTS carousel (
		id INTEGER(100) AUTO_INCREMENT PRIMARY KEY,
		user_id VARCHAR(${id_n_chars}),
		title VARCHAR(100), 
		body VARCHAR(500), 
		author VARCHAR(50),
		date VARCHAR(10), 
		time VARCHAR(10), 
		image LONGTEXT
		)`

		const posts = `
		CREATE TABLE IF NOT EXISTS posts (
		id INTEGER(100) AUTO_INCREMENT PRIMARY KEY,
		user_id VARCHAR(${id_n_chars}),
		title VARCHAR(100), 
		body VARCHAR(500), 
		author VARCHAR(50),
		date VARCHAR(10), 
		time VARCHAR(10), 
		image LONGTEXT
		)`

		const user_messages = `
		CREATE TABLE IF NOT EXISTS user_messages (
		id INTEGER(100) AUTO_INCREMENT PRIMARY KEY, 
		name VARCHAR(50), 
		body VARCHAR(500), 
		date VARCHAR(10), 
		time VARCHAR(10)
		)`

		const setFKChecks = `
		SET GLOBAL FOREIGN_KEY_CHECKS=0;
		`

		con.query(setFKChecks)

		const queries_arr = [
			user_info, 
			contact_info,
			makati_info,
			household_info,
			makati_cards,
			income_info,
			user_messages,
			officials,
			posts,
			carousel
		]

		function queries (query) {
			con.query(query, function (err) {
				if (err) throw err
			})
		}

		var counter = 0

		for (i of queries_arr) {
			counter += 1
			queries(i)
			counter == queries_arr.length ? console.log('Tables Created Successfuly!') : ''
		}
	}
})

module.exports = con