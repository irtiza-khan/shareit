const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const File = require('../modal/file');
const { v4: uuidv4 } = require('uuid');


//Using multer package to handle file 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})


let uploads = multer({
        storage,
        limits: { fileSize: 1000000 * 300 } //300 mb file size
    }).single('myfile') //this is the name from front end 


router.post('/', (req, res) => {
    //Store file in uploads folder
    uploads(req, res, async(err) => {
        //Validate Request 
        if (!req.file) {
            return res.status(401).json({ message: 'All fields Are Required' });
        }
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        ///store file data to database
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuidv4(),
        });

        //Sending response link
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });

    })



    //response link 
})


router.post('/send', async(req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    //Validation

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All Fields Are Required' })
    }

    //Find file data
    const file = await File.findOne({ uuid: uuid });
    // if (file.sender) { //checking if sender email is in database
    //     return res.status(422).send({ error: 'Email already send' })
    // }

    file.sender = emailFrom;
    file.reciever = emailTo;
    //Saving Data to database
    const response = await file.save();


    //Send Email 
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Share link of file from inshare',
        text: `${emailFrom} send you File Share link`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: '24 Hours'
        })

    })

    return res.send({ success: 'Email send to client' });


});


module.exports = router;