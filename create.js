const ora = require('ora');
const bouncingBall = require('cli-spinners').bouncingBall;
const links = process.argv.slice(2)
const fs = require('fs');
const Nightmare = require('nightmare');

const spinner = ora({ text: 'Baixando textos...', spinner: bouncingBall }).start();

const getTitle = link => {
  const nightmare = Nightmare();
  return nightmare
    .goto(link)
    .evaluate(() => {
      return document
        .querySelector('title')
        .innerText
        .replace(/(\r\n|\n|\r)/gm,'')
    })
    .end();
}

const getSlug = link => link.split('/').filter(Boolean).pop();

const createFileName = linkModel => linkModel.slug + '.md';
const createFileContent = linkModel => String.raw `# ${linkModel.title}
*Original: [${linkModel.title}](${linkModel.link})*
`;

const createMarkdownFile = linkModel => {

  return new Promise((resolve, reject) => {

    // Making the callback function a promisse function
    const callback = err => {
      err && reject(err);

      resolve(linkModel);
    }

    // Creating the file
    fs.writeFile(
      createFileName(linkModel),
      createFileContent(linkModel),
      callback
    )

  });
};



const promises = links.map(link => {
  return getTitle(link)
    .then(title => ({
      title,
      link,
      slug: getSlug(link)
    }))
    .then(createMarkdownFile)
    .then(linkModel => console.log(`File: "${createFileName(linkModel)}" created!`))
});

Promise.all(promises)
  .then(_ => {
    spinner.text = 'The end!';
    spinner.stop();
  })

