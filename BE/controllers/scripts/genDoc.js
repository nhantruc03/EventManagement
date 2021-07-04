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

        var table = [
            [
                {
                    val: 'Tên',
                    opts: {
                        cellColWidth: 1000,
                        b: true,
                        sz: '24',
                        shd: {
                            fill: '7F7F7F',
                            themeFill: 'Arial',
                            themeFillTint: '10'
                        }
                    }
                },
                {
                    val: 'Thời gian',
                    opts: {
                        cellColWidth: 1000,
                        b: true,
                        sz: '24',
                        shd: {
                            fill: '7F7F7F',
                            themeFill: 'Arial',
                            themeFillTint: '10'
                        }
                    }
                },
                {
                    val: 'Nội dung',
                    opts: {
                        cellColWidth: 1000,
                        b: true,
                        sz: '24',
                        shd: {
                            fill: '7F7F7F',
                            themeFill: 'Arial',
                            themeFillTint: '10'
                        }
                    }
                },

            ],
        ]
        list_details.sort((a, b) => {
            let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
            let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
            return temp_b.isBefore(temp_a) ? 1 : -1;
        }).forEach((e, i) => {
            // pObj = docx.createP()
            // pObj.addText(`${i + 1}. ${e.name}`, { font_size: 12, bold: true, font_face: 'Times New Roman' });
            // pObj = docx.createP()
            // pObj.addText(`Thời gian: ${moment(e.time).utcOffset(0).format('HH:mm')}`, { font_size: 12, font_face: 'Times New Roman' });
            // pObj = docx.createP()
            // pObj.addText(`Mô tả: ${htmlToText(e.description)}`, { font_size: 12, font_face: 'Times New Roman' });
            let temp = []
            temp.push(e.name)
            temp.push(moment(e.time).utcOffset(0).format('HH:mm'))
            // console.log('-------------', htmlToText(e.description).replace(/(\n)/gm,'\r\n'))
            temp.push(htmlToText(e.description).replace(/(\n)/gm,'\r\n'))
            table.push(temp)
        })

        console.log(table)

        var tableStyle = {
            tableColWidth: 4261,
            tableSize: 72,
            tableColor: 'ada',
            tableAlign: 'left',
            tableFontFamily: 'Times New Roman',
            borders: true
        }


        // var table = [
        //     [{
        //       val: "No.",
        //       opts: {
        //         cellColWidth: 4261,
        //         b:true,
        //         sz: '48',
        //         spacingBefor: 120,
        //         spacingAfter: 120,
        //         spacingLine: 240,
        //         spacingLineRule: 'atLeast',
        //         shd: {
        //           fill: "7F7F7F",
        //           themeFill: "text1",
        //           "themeFillTint": "80"
        //         },
        //         fontFamily: "Avenir Book"
        //       }
        //     },{
        //       val: "Title1",
        //       opts: {
        //         b:true,
        //         color: "A00000",
        //         align: "right",
        //         shd: {
        //           fill: "92CDDC",
        //           themeFill: "text1",
        //           "themeFillTint": "80"
        //         }
        //       }
        //     },{
        //       val: "Title2",
        //       opts: {
        //         align: "center",
        //         vAlign: "center",
        //         cellColWidth: 42,
        //         b:true,
        //         sz: '48',
        //         shd: {
        //           fill: "92CDDC",
        //           themeFill: "text1",
        //           "themeFillTint": "80"
        //         }
        //       }
        //     }],
        //     [1,'All grown-ups were once children',''],
        //     [2,'there is no harm in putting off a piece of work until another day.',''],
        //     [3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
        //     [4,'You can include CR-LF inline\r\nfor multiple lines.',''],
        //     [5,['Or you can provide lines within', 'a cell in an array'],''],
        //     [6,'But when it is a matter of baobabs, that always means a catastrophe.',''],
        //     [7,'watch out for the baobabs!','END'],
        //   ]

        //   var tableStyle = {
        //     tableColWidth: 4261,
        //     tableSize: 24,
        //     tableColor: "ada",
        //     tableAlign: "left",
        //     tableFontFamily: "Comic Sans MS",
        //     spacingBefor: 120, // default is 100
        //     spacingAfter: 120, // default is 100
        //     spacingLine: 240, // default is 240
        //     spacingLineRule: 'atLeast', // default is atLeast
        //     indent: 100, // table indent, default is 0
        //     fixedLayout: true, // default is false
        //     borders: true, // default is false. if true, default border size is 4
        //     borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
        //   }
        pObj = docx.createTable(table, tableStyle)

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
