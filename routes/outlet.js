let express = require('express');
let router = express.Router();


// using togeojson in nodejs

let tj = require('@mapbox/togeojson');
let fs = require('fs');
let d3 = require('d3-geo');
// node doesn't have xml parsing or a dom. use xmldom
let DOMParser = require('xmldom').DOMParser;

const opencage = require('opencage-api-client');

/***************************************************************
 * Get Outlet By Address
 ***************************************************************/
router.get('/', async function (req, res, next) {
  let { address } = req.query;

  if (!address) {
    res.send('Invalid address')
  }
  // Convert KML to JSON
  let kml = new DOMParser().parseFromString(fs.readFileSync('public/addr.kml', 'utf8'));
  let converted = tj.kml(kml);

  let coordinates = null;
  let location = await opencage.geocode({ q: address });
  coordinates = location.results[0].geometry;
  let formatedCoordinates = Object.values(coordinates)
  let assignedOutlet = null;
  converted.features.forEach((d) => {
    if (d3.geoContains(d, [
      formatedCoordinates[1],
      formatedCoordinates[0]
    ])) {
      assignedOutlet = d;
    }
  })
  res.send(assignedOutlet ? assignedOutlet.properties.name : 'not found')
});


/***************************************************************
 * Search
 ***************************************************************/
router.get('/search', (req, res, next) => {
  res.render('outlet')
})

module.exports = router;
