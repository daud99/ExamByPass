const FormData = require("form-data");
const fs = require("fs");
const { validationResult } = require("express-validator");
const ParserClient = require("../integrations/parser-client");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");

module.exports = new (class {
  async uploadFile(req, res, next) {
    console.log("i am here", req.file);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!req.file || req.file == null) {
        throw new Error("Error uploading file");
      }

      var data = new FormData();
      data.append("file", fs.createReadStream(req.file.path));
      console.log("data is", data);
      var response = await ParserClient.performUploadFileRequest({
        method: "POST",
        path: "/upload",
        data: data,
        file_path: req.file.path,
      });

      res.send({
        data: response,
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
  async getQuestions(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let limit = 5; // number of records per page
      let offset = 0;

      Question.findAndCountAll({ where: { exam_library_id: 2 } }).then(
        (question) => {
          let page = req.params.page; // page number
          let pages = Math.ceil(question.count / limit);
          offset = limit * (page - 1);

          Question.findAll({
            limit: limit,
            offset: offset,
            $sort: { id: 1 },
          }).then((question) => {
            console.log(question);
            res.send(question);
          });
        }
      );
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
  async getAnswers(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      Answer.findAll({ where: { question_id: req.params.question_id } }).then(
        (answer) => {
          //console.log(answer)

          res.send(answer);
        }
      );
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
})();
