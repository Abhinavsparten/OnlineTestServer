const Mark = require('../models/markss');
const Competition = require('../models/CompetitionScore');

// Controller for adding marks
exports.marksAdd = async (req, res) => {
  const { subject, correctAnswersCount, questions, date, uid,username,timeTaken } = req.body;

  try {
    const newMark = new Mark({
      subject,
      correctAnswersCount,
      questions,
      date,
      uid,
      username,
      timeTaken
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

// Controller for adding marks in online competition marks 
exports.competitionMarks = async (req, res) => {
  const { subject, correctAnswersCount, questions, date, uid,username,
        timeTaken} = req.body;

  try {
    const newComp = new Competition({
      subject,
      correctAnswersCount,
      questions,
      date,
      uid,
      username,
      timeTaken
    });

    await newComp.save();
    res.status(200).send({ message: 'Marks Added' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Controller for getting all marks in competition
exports.getCompetitionMarks = async (req, res) => {
  const { uid, subject } = req.body;
  try {
    let compMarks = [];

    if (subject === 'all') {
      compMarks = await Competition.find();
    } else {
      compMarks = await Competition.find({ subject });
    }

    // Sorting compMarks array by correctAnswersCount in descending order,
    // and then by timeTaken in ascending order to show the fastest timeTaken first
    compMarks = compMarks.sort((a, b) => {
      if (b.correctAnswersCount === a.correctAnswersCount) {
        return a.timeTaken - b.timeTaken;
      }
      return b.correctAnswersCount - a.correctAnswersCount;
    });

    res.status(200).json(compMarks);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
