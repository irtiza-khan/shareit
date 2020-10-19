const router = require('express').Router();
const File = require('../modal/file');

router.get('/:id', async(req, res) => {
    try {

        const id = req.params.id;
        const file = await File.findOne({ uuid: id });
        if (!file) {
            req.flash('error', 'Enable to find the file');
            return res.render('download');
        }

        return res.render('download', {
            uuid: file.uuid,
            filename: file.filename,
            size: file.size,
            download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
                //http://localhost:3000/files/download/2791941-1864196416
        })

    } catch (err) {
        req.flash('error', 'Something Went Wrong ');
        return res.status(500).render('download');
    }


})


module.exports = router;