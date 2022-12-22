//* DOTENV
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

//* Initialization
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

// Express
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash') // express-flash - connect-flash

const path = require('path')
const logger = require('morgan');
const app = express()

//* Memory Leak Fix
// const MySQLStore = require('express-mysql-session')(session);
// const database = require('./database');

// const sessionStore = new MySQLStore(database);

//* Access File Exports
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    // store: sessionStore, //* Memory Leak Fix
    debug: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//* app use to access folders
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname + 'node_modules')))
app.use(express.static(__dirname + 'public/stylesheets'))
app.use(express.static(__dirname + 'public/javascripts'))
app.use(express.static(__dirname + 'public/images'))


//* View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//* ROUTES AND URLS COMING FROM ROUTES.JS FILES 
//X SUPER ADMIN ONLY
const adminOfficials = require('./routes/Admin/brgyofficials')
app.use('/adminBrgyOfficials', adminOfficials)

//x ADMIN AND BRGY OFFICIALS
//^ will create a brgy officials page for 
const adminTable = require('./routes/Admin/tables')
const adminDashboard = require('./routes/Admin/dashboard')
const adminPosts = require('./routes/Admin/posts')
app.use('/adminDashboard', adminDashboard)
app.use('/adminposts', adminPosts)
app.use('/admintable', adminTable)
app.use('/admin', adminTable)

//x USER (Logged in)
const homepage = require('./routes/User/homepage')
const aboutUs = require('./routes/User/about_us')
app.use('/', homepage)
app.use('/aboutus', aboutUs)

//! USER Services
const services = require('./routes/User/services/services')
const healthCenter = require('./routes/User/services/health_center')
const fireDept = require('./routes/User/services/fire_dept')
const maintenance = require('./routes/User/services/maintenance')
const agricultural = require('./routes/User/services/agricultural')
app.use('/services', services)
app.use('/health-center', healthCenter)
app.use('/fire-dept', fireDept)
app.use('/maintenance', maintenance)
app.use('/agricultural', agricultural)

//X GLOBAL
const register = require('./routes/register')
const loginpage = require('./routes/login')
const errorpage = require('./routes/404')

app.use('/register', register)
app.use('/login', loginpage)
app.use('/404', errorpage)

// REDIRECTS ALL USERS IF URL IS NOT FOUND
app.all('*', (req, res) => {
    res.redirect("/404");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

port = 5000 // 5000 for online, 3000 default

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

module.exports = app