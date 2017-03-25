const cors = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

const errorHandler = function (error, request, response, next) {
    console.log(error);
    response.status(error.statusCode).json({
        name: error.name,
        message: error.message,
        stack: null
    });
};

exports.cors = cors;
exports.errorHandler = errorHandler;