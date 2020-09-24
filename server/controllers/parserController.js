const FormData = require('form-data')
const fs = require('fs')
const { validationResult } = require('express-validator')
const ParserClient = require('../integrations/parser-client')


module.exports = new class {

    async uploadFile(req, res, next) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if(!req.file || req.file == null) {
          throw new Error("Error uploading file");
        }

        var data = new FormData();
        data.append('file', fs.createReadStream(req.file.path));
        var response = await ParserClient.performUploadFileRequest({
            "method": "POST",
            "path": "/upload",
            "data": data,
            "file_path": req.file.path
        });

        res.send({
            data: response,
        });

      }
      catch(e) {
        console.log(e);
        res.status(400).send({
           "status": 400,
           "error": "Bad Request",
        });
      }


    }

}
