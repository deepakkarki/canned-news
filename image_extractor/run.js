'use strict';
const models = require('fbm-shared/models');
const ImageResolver = require('image-resolver');
const extractor = new ImageResolver();
const hoursBack = process.env.HOURS_BACK;

extractor.register(new ImageResolver.FileExtension());
extractor.register(new ImageResolver.MimeType());
extractor.register(new ImageResolver.Opengraph());
extractor.register(new ImageResolver.Webpage());

async function run() {
  const entries = await getEntries();

  return Promise.all(entries.map((entry) => {

    return new Promise((resolve) => extractor.resolve(entry.url, resolve))
      .then(async (result) => {
        let imageUrl = null;
        if (result && result.image) {
          imageUrl = result.image;
        }
        return await entry.update({
          image_url: imageUrl,
          image_extracted_at: (new Date()).toISOString(),
        });
      }).catch(err => {
        console.error(err.toString());
        return err;
      });
  }));
}

function getEntries() {
  const minDate = (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString();

  return models.Entry.findAll({
    where: {
      feedbin_published_at: {
        $gt: minDate
      },
      url_resolved_at: {
        $ne: null
      },
      image_extracted_at: {
        $eq: null
      }
    },
  });
}

run().then((entries) => {
  console.log("Extracted images for " + entries.length + " entries less than " + hoursBack + " hours old.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
