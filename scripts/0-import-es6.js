require("babel-register")
if (process.env.NPM_ENV === 'production') {
  require("dotenv").config()
}
// keep hubot from complaining
module.exports = function(bot){}