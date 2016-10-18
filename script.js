const Nightmare = require('nightmare')
const nightmare = Nightmare()
const argv = require('minimist')(process.argv.slice(2))
const urlRegx = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i


const isString = value => ({}).toString.call(value) === '[object String]'
const isUrl = value => urlRegx.test(value)

function openUrl(url) {
  if(!url || !isString(url) || !isUrl(url)) {
    console.log('No url found...')
    return false
  }

  nightmare
    .goto(url)
    .evaluate(() => {
      return document
        .querySelector('meta[property="og:image"]')
        .getAttribute('content')
    })
    .end()
    .then(console.log)
}

openUrl(argv._[0] || argv.url)
