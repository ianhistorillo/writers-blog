import fs from 'fs';

const routes = JSON.parse(fs.readFileSync('./react-snap-routes.json', 'utf-8'));

export default {
  sourceDir: 'build',
  include: routes,
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  crawl: false, // only crawl the routes you specify
  snapDirectory: true, // IMPORTANT: create folders with index.html inside
};