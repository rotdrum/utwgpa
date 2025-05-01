
module.exports = function (res) {
    return res.status(404).json({
        status: {
            code: 404,
            message: "Not Found"
        }
    });
}