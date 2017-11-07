require("babel-register")
if (process.env.NPM_CONFIG_PRODUCTION) {
  require("dotenv").config()
}
// keep hubot from complaining
module.exports = function(bot){}