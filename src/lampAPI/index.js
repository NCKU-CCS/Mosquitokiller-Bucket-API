// Exports API Model
module.exports = {
  Places: require('./lampPlaces/placesModel.js'),
  Lamps: require('./lamps/lampsModel.js'),
  Counts: require('./lampCounts/countsModel.js'),
  States: require('./lampStates/statesModel.js'),
  Rules: require('./lampMccRules/rulesModel.js'),
  Mcc: require('./lampMcc/mccModel.js'),
  Comments: require('./lampComments/commentsModel.js')
}
