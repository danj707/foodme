exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                       'mongodb://admin:production@ds153667.mlab.com:53667/foodme' :
                       'mongodb://localhost/foodme');
exports.PORT = process.env.PORT || 8080;
