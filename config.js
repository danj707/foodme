exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://admin:dbpassword@ds153667.mlab.com:53667/foodme' :
                            'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
