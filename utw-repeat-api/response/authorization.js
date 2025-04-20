
module.exports = function (res, err) {
    return res.status(400).json({
        error: {
            message: err,
        },
        status: {
            code: 400,
            message: "Authorization"
        }
    });
}