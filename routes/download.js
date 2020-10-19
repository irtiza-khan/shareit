const router = require('express').Router();
const File = require('../modal/file');

router.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findOne({ uuid: id });
        if (!file) {
            req.flash('error', 'Link Has Been Expired ');
            return res.render('download');
        }
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    } catch (err) {

    }
})

module.exports = router;