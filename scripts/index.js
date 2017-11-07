
require("babel-register");
import GitHub from 'github-api'
require('dotenv').config()

const gh = new GitHub({token: process.env.GITHUB_TOKEN})

const issueRegex = /(?:\s?)([\w-_]+)\/([\w-_]+)#([0-9]+)(?:.*)$/i
const issueUrlRegex = /https?:\/\/github\.com\/([\w-_]+)\/([\w-_]+)\/(?:pull|issue)s?\/([0-9]+)/i

module.exports = (robot) => {


  robot.hear(issueRegex, handleIssue)

  robot.hear(issueUrlRegex, handleIssue)

  robot.router.post('/test', (req, res) => {
    robot.send({ room: req.params.room }, `Received HTTP request: ${req.body.value}`)
    res.send('OK')
  })
}

const handleIssue = res => {
  const [ fullMatch, user, repo, num ] = res.match
  gh.getIssues(user, repo).getIssue(num)
    .then(
      (i) => {
        const isPR = !!i.data.pull_request
        const { html_url, title, state } = i.data
        res.send(`${isPR ? '[PR]\t' : '[Issue]\t'}<${html_url}|${fullMatch}>:\t${state === 'closed' ? '(Closed)' : '(Open)'}\n>${title}`)
      },
      (r) => res.send(`>Couldn't find an issue/pr like ${user}/${repo}#${num}`))
}
