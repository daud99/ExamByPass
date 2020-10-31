const FormData = require("form-data");
const fs = require("fs");
const { validationResult } = require("express-validator");
const ParserClient = require("../integrations/parser-client");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const Testlet = require("../models/Testlet");
const AnswerArea = require("../models/answerArea.js");
const ExamLibrary = require("../models/examLibrary.js");
const StructureEntry = require("../models/structureEntry");
const StructureEntryLink = require("../models/structureEntryQuestionLink");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
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

      var data = new FormData(this);
     data.append("file", fs.createReadStream(req.file.path));
      data.append("user_id", 1);
    
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
      let limit = 50; // number of records per page
      let offset = 0;
     //console.log("hi hello",req.params.structureEntryQuestionn)
      var selectedCheck = req.params.selectedCheck.split(',');
      var structureEntryQuestionn = req.params.structureEntryQuestionn.split(',');
      console.log("hello world", req.params.structureEntryQuestionn)
     if(req.params.structureEntryQuestionn == 0){
       console.log("i am if")
      Question.findAndCountAll({ where: { exam_library_id: req.params.examId , type:{[Op.in]: selectedCheck}} }).then(
        (question) => {
          
          let totalQuestions = question.count
          let page = req.params.page; // page number
          let pages = Math.ceil(question.count / limit);
          offset = limit * (page - 1);
         

          Question.findAll({
            limit: limit,
            offset: offset,
            $sort: { id: 1 },
            where: {
              exam_library_id: {
                [Op.eq]: req.params.examId,
              },
              type:{[Op.in]: selectedCheck}
            },
          }).then((question) => {
           // console.log(question);
            let questionsCount 
            questionsCount = question.concat({count:totalQuestions});
            questionsCount = [...question, {count:totalQuestions}];
            res.send(questionsCount);
          });
        }
      );
     }else{
      console.log("i am else")
      Question.findAndCountAll({ where: { exam_library_id: req.params.examId , type:{[Op.in]: selectedCheck}, id:{[Op.in]: structureEntryQuestionn}} }).then(
        (question) => {
          
          let totalQuestions = question.count
          let page = req.params.page; // page number
          let pages = Math.ceil(question.count / limit);
          offset = limit * (page - 1);
         

          Question.findAll({
            limit: limit,
            offset: offset,
            $sort: { id: 1 },
            where: {
              exam_library_id: {
                [Op.eq]: req.params.examId,
              },
              type:{[Op.in]: selectedCheck}
            },
          }).then((question) => {
           // console.log(question);
            let questionsCount 
            questionsCount = question.concat({count:totalQuestions});
            questionsCount = [...question, {count:totalQuestions}];
            res.send(questionsCount);
          });
        }
      );
     }
      
    } catch (e) {
      console.log(e);
      res.status(400).send({
        status: 400,
        error: "Bad Request",
      });
    }
  }
  async getTypes(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      Question.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type'],
        ],
        where: { exam_library_id: req.params.examId} }).then(
        (answer) => {
          //console.log(answer)
          answer.forEach((item, i) => {
            item.id = i + 1;
          });
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
       // console.log("i am exam",exams)

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
  async getTestlet(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      Testlet.findAll({ where: { exam_library_id: req.params.examId } }).then(
        (testlet) => {
          //console.log(answer)

          res.send(testlet);
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
  async structureEntry(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      StructureEntry.findAll({ where: { exam_library_id: req.params.examId } }).then(
        (StructureEntry) => {
          //console.log(answer)

          res.send(StructureEntry);
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
  async structureEntryQuestion(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      StructureEntryLink.findAll({ where: { structure_entry_id: req.params.structureId } }).then(
        (StructureEntryLink) => {
          //console.log(answer)

          res.send(StructureEntryLink);
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
