const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('./react-snap-routes.json', 'utf-8'));

module.exports = {
  sourceDir: 'dist',
  include: routes,
  crawl: false,
  snapDirectory: true,
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  onPageError: (page, error) => {
    console.error('🔥 page error at', page.url(), error.message);
  },
};