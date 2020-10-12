const FormData = require("form-data");
const fs = require("fs");
const { validationResult } = require("express-validator");
const ParserClient = require("../integrations/parser-client");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const AnswerArea = require("../models/answerArea.js");
const ExamLibrary = require("../models/examLibrary.js");
const { Op } = require("sequelize");
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
            where: {
              type: {
                [Op.eq]: "HOT_AREA",
              },
            },
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
  async getAnswersArea(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      AnswerArea.findAll({
        where: { answer_id: req.params.answer_id },
      }).then((answer_area) => {
        //console.log(answer)

        res.send(answer_area);
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
  async getExams(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      ExamLibrary.findAll(
      ).then((exams) => {
        //console.log(answer)

        res.send(exams);
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
})();
