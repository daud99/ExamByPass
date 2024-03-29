const { validationResult } = require('express-validator');
const ExamUserSession = require("../models/ExamUserSession");
module.exports = new class {
async saveSessionExam(req,res, next) {
    try {
        let userIdd = req.body.userId
        let guestId = req.body.guestId
        for (let index = 0; index < req.body.record.length; index++) {
        
            await ExamUserSession.create({
                TestletId: req.body.record[index].TestletId,
                allow_shuffle_answers: req.body.record[index].allow_shuffle_answers,
                conditionOf: req.body.record[index].condition,
                content: req.body.record[index].content,
                description: req.body.record[index].description,
                examLibraryId: req.body.record[index].examLibraryId,
                explanation: req.body.record[index].explanation,
                extras: req.body.record[index].extras,
                has_exhibits: req.body.record[index].has_exhibits,
                task_image: req.body.record[index].task_image,
                is_accessible_in_demo_version: req.body.record[index].is_accessible_in_demo_version,
                offset: req.body.record[index].offset,
                type: req.body.record[index].type,
                id: req.body.record[index].id,
                userId: userIdd,
                guestId: guestId,
                page: req.body.record[index].page,
                examId: req.body.record[index].examId,
                selectedCheck: req.body.record[index].selectedCheck,
                indexVar: req.body.record[index].indexVar,
                counterL: req.body.record[index].counterL,
                totalQuestions: req.body.record[index].totalQuestions,
                candidateName: req.body.record[index].candidateName,
                selectedRandomAnswer: req.body.record[index].selectedRandomAnswer,
                 selectedRandomQuestion: req.body.record[index].selectedRandomQuestion,
                selectedTab: req.body.record[index].selectedTab,
                obtainScore: req.body.record[index].obtainScore,
                
            })
        }
        
        res.send({
            data: {
                msg: "Session saved Successfully!"
            }
        })
    }
    catch(e) {
        console.log(e)
        res.status(400).send({
        "status": 400,
        "error": "Bad Request",
        });
    }
    }
    
    async getSessionExam(req,res, next) {
       
        try {
            const examSessions = await ExamUserSession.findAll({
                where: {
                    userId: req.query.paramS,
                    examLibraryId:req.query.examId
                 
                }
            });
            res.send({
                data: {
                    examSessions
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async deleteSessionExam(req,res, next) {
        try {
            const messages = await ExamUserSession.destroy({
                where: {
                    userId: req.body.id,
                    examLibraryId:req.query.examId
                }
            });
         
            res.send({
                data: {
                    msg: "Session deleted Successfully!",
                    messages
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }
     async getGuestSessionExam(req,res, next) {
       
        try {
            const examSessions = await ExamUserSession.findAll({
                where: {
                    guestId: req.query.paramS,
                    examLibraryId:req.query.examId
                 
                }
            });
            res.send({
                data: {
                    examSessions
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }

    async deleteGuestSessionExam(req,res, next) {
        try {
            const messages = await ExamUserSession.destroy({
                where: {
                    guestId: req.body.id,
                    examLibraryId:req.query.examId
                }
            });
         
            res.send({
                data: {
                    msg: "Session deleted Successfully!",
                    messages
                }
            })
        }
        catch(e) {
            console.log(e)
            res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            });
        }
    }
    async updateSessionStatus(req, res, next) {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
         
          console.log("qryy",req.query)
          ExamUserSession.update({ isDelete: 1 },{
            where: {
                  examLibraryId: req.query.examId,
                    userId: req.query.paramS,
                
            }
          }).then(
            (t) => {
              console.log(t)
    
              res.send(t);
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
}
