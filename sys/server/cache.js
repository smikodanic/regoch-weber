const path = require('path');
const fs = require('fs'); const fsp = fs.promises;
const cwd = process.cwd();


/**
  * Remove empty spaces, new lines, tabs and HTML comments.
  * @param {string} html - HTML code
  * @return {string} - minified HTML
  */
const minifyHTML = (html) => {
  html = html.replace(/\t+/g, ' ');
  html = html.replace(/\s+/g, ' ');
  html = html.replace(/\n+/g, '');
  html = html.replace(/\r+/g, '');
  html = html.replace(/> </g, '><');
  html = html.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, ''); // remove comments
  html = html.trim();
  return html;
};


module.exports.views = async (files) => {
  // get HTML strings from the views
  const views = {};
  for (const file of files) {
    const filepath = path.join(cwd, 'client/views', file);
    if (!fs.existsSync(filepath)) { throw new Error(`File "${filepath}" doesn't exist.`); }
    let content = await fsp.readFile(filepath, { encoding: 'utf8' });
    content = minifyHTML(content);
    views[file] = content;
  }

  const dir = path.join(cwd, 'client/_cache');
  const file = 'views.js';

  // ensure directory
  await fsp.mkdir(dir, { recursive: true });

  // create _cache/views.js file
  const fileDest = path.join(dir, file);
  const fileContent = `export default ${JSON.stringify(views, null, 2)};`;
  await fsp.writeFile(fileDest, fileContent, { encoding: 'utf8' });

  console.log('👌  Views cached to "client/_cache/views.js":', files);
};
