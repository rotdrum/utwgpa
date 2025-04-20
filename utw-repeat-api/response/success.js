
module.exports = function (res, data) {
    return res.status(200).json({
        data: data,
        status: {
            code: 200,
            message: "OK"
        }
    });
}