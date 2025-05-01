
module.exports = function (res) {
    return res.status(201).json({
        data: [],
        status: {
            code: 201,
            message: "OK"
        }
    });
}