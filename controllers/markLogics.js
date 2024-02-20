const Mark = require('../models/markss');

// Controller for adding marks
exports.marksAdd = async (req, res) => {
  const { subject, correctAnswersCount, questions, date, uid } = req.body;

  try {
    const newMark = new Mark({
      subject,
      correctAnswersCount,
      questions,
      date,
      uid
    });

    await newMark.save();
    res.status(200).send({ message: 'Marks Added' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Controller for getting all marks
exports.getMarksAll = async (req, res) => {
  const { uid } = req.params;

  try {
    const userMarks = await Mark.find({ uid });
    res.status(200).json(userMarks);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
