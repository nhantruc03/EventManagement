// import {calcPorcess} f

const { calcProcess } = require("./calcProcess")

const getProcess = async (req, res) => {
    try {
        var doc = await calcProcess(req.params.id);

        if(doc === null){
            doc = 0
        }

        return res.status(200).json({
            success: true,
            data: doc
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { getProcess }