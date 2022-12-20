// const mysql = require('mysql');

// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: ''
// })

// var db = 'BCDBMS'
// function name_db() {
//     con.connect(function (error) {
//         if (error) {
//             throw error;
//         }
//         else {
//             console.log('MySQL Database is connected Successfully\n')

//             //CREATE DB IF NOT EXISTS
//             con.query(`CREATE DATABASE IF NOT EXISTS ${db}`, (err, result) => {
//                 if (err) throw err;
//                 //else
//                 console.log('Database created Successfully!')
//             })
//         }
//     });
// }


// module.exports = {
//     setDB: function () {
//         name_db()
//     },
//     name: function () {
//         return 'BCDBMS'
//     }
// }