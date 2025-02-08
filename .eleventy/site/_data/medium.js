var axios = require('axios');
var toJSON = require('xml2js').parseString;

var url = process.env.MEDIUM_FEED || 'https://medium.com/feed/netlify';

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        // Turn the feed XML into JSON
        toJSON(response.data, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          // Create a clean path for each item
          result.rss.channel[0].item.forEach(element => {
            var urlParts = element.link[0].split('/');
            var slug = urlParts[urlParts.length - 1].split('?')[0];

            // Generate the correct path with no duplication
            element.path = `/@jessefreeman/foam-eleventy-mvp.main/apps/code-server/proxy/8080/${slug}`; // Avoid leading slashes
          });

          resolve({ posts: result.rss.channel[0].item });
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
