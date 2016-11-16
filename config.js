exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                       'mongodb://localhost/foodme' :
                       'mongodb://admin:foodme@ds153667.mlab.com:53667/foodme');
exports.PORT = process.env.PORT || 8080;
