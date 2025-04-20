
module.exports = function (res, err) {
    return res.status(422).json({
        error: {
            message: err,
        },
        status: {
            code: 422,
            message: "Unprocessable Entity"
        }
    });
}