const Scripts = require("../../models/scripts")
const officegen = require('officegen');
const fs = require('fs')
const ScriptDetails = require('../../models/scriptDetails')
const moment = require('moment')
const { pick } = require("lodash")
const { htmlToText } = require('html-to-text');

const genDoc = async (req, res) => {
    try {
        let docx = officegen('docx');


        const doc = await Scripts.findById(req.body.scriptId)
            .populate({ path: 'eventId', select: 'name startDate startTime' })
            .populate({ path: 'writerId', select: 'name' })
            .populate({ path: 'forId', select: 'name' })

        const list_details = await ScriptDetails.find({ ...pick(req.body, "scriptId"), isDeleted: false })

        docx.setDocSubject(`Kịch bản ${doc.name}`);
        docx.setDocKeywords('keywords');
        docx.setDescription('Mô tả');




        var pObj = docx.createP({ align: 'center' });
        pObj.addText('Kịch bản: ', { font_size: 12, font_face: 'Times New Roman' });
        pObj.addText(doc.name, { bold: true, font_size: 16, font_face: 'Times New Roman' });


        pObj = docx.createP();
        pObj = docx.createP()

        pObj.addText(`Thuộc sự kiện: `, { font_size: 12, font_face: 'Times New Roman' });
        pObj.addText(doc.eventId.name, { font_size: 12, bold: true, font_face: 'Times New Roman' });
        pObj = docx.createP()
        pObj.addText(`Thời gian sự kiện: `, { font_size: 12, font_face: 'Times New Roman' });
        pObj.addText(`${moment(doc.eventId.startTime).utcOffset(0).format('HH:mm')} - ${moment(doc.eventId.startDate).utcOffset(0).format('DD/MM/YYYY')}`, { font_size: 12, bold: true, font_face: 'Times New Roman' });
        pObj = docx.createP()
        pObj.addText(`Người viết kịch bản: `, { font_size: 12, font_face: 'Times New Roman' });
        pObj.addText(doc.writerId.name, { font_size: 12, bold: true, font_face: 'Times New Roman' });
        pObj = docx.createP()
        pObj.addText(`Người thực hiện: `, { font_size: 12, font_face: 'Times New Roman' });
        pObj.addText(doc.forId.name, { font_size: 12, bold: true, font_face: 'Times New Roman' });


        pObj = docx.createP();
        pObj = docx.createP()
        pObj.addText(`Nội dung kịch bản`, { font_size: 14, bold: true, font_face: 'Times New Roman' });
        list_details.sort((a, b) => {
            let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
            let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
            return temp_b.isBefore(temp_a) ? 1 : -1;
        }).forEach((e, i) => {
            pObj = docx.createP()
            pObj.addText(`${i + 1}. ${e.name}`, { font_size: 12, bold: true, font_face: 'Times New Roman' });
            pObj = docx.createP()
            pObj.addText(`Thời gian: ${moment(e.time).utcOffset(0).format('HH:mm')}`, { font_size: 12, font_face: 'Times New Roman' });
            pObj = docx.createP()
            pObj.addText(`Mô tả: ${htmlToText(e.description)}`, { font_size: 12, font_face: 'Times New Roman' });
        })



        if (!fs.existsSync(`./resources/${req.body.scriptId}`)) {
            fs.mkdirSync(`./resources/${req.body.scriptId}`);
        }
        let out = fs.createWriteStream(`resources/${req.body.scriptId}/script.docx`)

        // Async call to generate the output file:
        docx.generate(out)
        return res.status(200).json({
            success: true,
            url: `/api/resources/${req.body.scriptId}/script.docx`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = { genDoc };
