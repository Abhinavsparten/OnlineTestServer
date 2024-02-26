const mongoose=require('mongoose')
const schedule = require('node-schedule');
const Competition = require('../models/CompetitionScore');

mongoose.connect(process.env['DATABASE']).then(()=>{
    console.log("...Mongodb atlas connected ");
}).catch((error)=>{
    console.log("connection error"+error);
})

// Function to clear the collection
const clearCollection = async () => {
  try {
    await Competition.deleteMany({});
    console.log('Competition collection cleared successfully!');
  } catch (error) {
    console.error('Error clearing competition collection:', error);
  }
};

// Schedule the job to run every 24 hours
schedule.scheduleJob('0 0 * * *', () => {
  console.log('Scheduling clearCompetitionCollection job...');
  clearCollection();
});

console.log('Job scheduled to run every 24 hours.');

module.exports = Competition;