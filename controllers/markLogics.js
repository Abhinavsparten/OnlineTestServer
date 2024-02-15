// Corrected code for marksAdd controller
const marks = require('../models/markss');

// for add marks
exports.marksAdd = async (req, res) => {
  const { subject, correctAnswersCount, questions, date, uid } = req.body;

  try {
    const newMark = new marks({
      subject,
      correctAnswersCount,
      questions,
      date,
      uid
    });

    await newMark.save();
    res.status(200).send({ message: "Marks Added" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

//get all marks
exports.getMarksAll = async (req, res) => {

  const { uid } = req.params

    try {
        const preuser = await marks.find({uid})
        res.status(200).json(preuser);
    } catch (error) {
        res.status(401).send("Server Error");

    }

};