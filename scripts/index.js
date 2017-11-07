
require("babel-register");
import GitHub from 'github-api'
require('dotenv').config()

const gh = new GitHub({token: process.env.GITHUB_TOKEN})

const issueRegex = /(?:\s?)([\w-]+)\/([\w-]+)#([0-9]+)(?:.*)$/i

module.exports = (robot) => {

  robot.hear(/hello robot/, res => res.send('hello back'))

  robot.hear(issueRegex, res => {
    console.log('toot toot')
    const [ fullMatch, user, repo, num ] = res.match
    res.send(user, repo, num)
    gh.getIssues(user, repo).getIssue(num)
      .then(i => {
        const isPR = !!i.data.pull_request
        const { url, title, state } = i.data
        res.send(`${isPR ? 'PR: ' : ''}[${fullMatch}](${url}) (${state === 'closed' ? 'CLOSED' : 'OPEN'})
        ${title}`)
      })
  })

  robot.router.post('/test', (req, res) => {
    robot.send({ room: req.params.room }, `Received HTTP request: ${req.body.value}`)
    res.send('OK')
  })
}

const handleIssue = (resp) => i => {
  const isPR = !!i.data.pull_request
  const { url, title, state } = i.data
  resp.send(`[${fullMatch}](${url}): [${state === 'closed' ? 'CLOSED' : 'OPEN'}]`)
}

// const findMatches = (text, acc = []) => {
//   const match = issueRegex.exec(text)
//   if (match) {
//     const [ fullMatch, user, repo, num, index ] = match
//     const nextText = text.slice(index).replace(fullMatch, '')
//     return findMatches(nextText, acc.push({user, repo, num}))
//   } else return acc
// }