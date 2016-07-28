require('isomorphic-fetch')
const POKÉDEX = require('../pokedex')
const compose = (...fs) => (...args) => !fs.length
  ? args[0]
  : compose(...fs.slice(0, fs.length - 1))(fs[fs.length - 1](...args))
const toLowerCase = a => a.toLowerCase()
const capitalize = a => a.charAt(0).toUpperCase() + a.slice(1)
const indexOf = xs => a => xs.indexOf(a)
const call = k => a => a[k]()
const prop = k => a => a[k]
const gt = x => a => a > x
const add = x => a => a + x
const filter = f => xs => xs.filter(f)
const map = f => xs => xs.map(f)
const each = f => xs => xs.forEach(f)
// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
const dist = (lat1, lon1, lat2, lon2) => {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
const resolve = Promise.resolve.bind(Promise)
const handleErrors = res => {
  console.log(`[PokéMonitor] Last Update @ ${(new Date()).toLocaleString()}`)
  if (!res.ok) throw Error(res.statusText)
  return res
}
const resolvePokés = compose(
  resolve,
  prop('pokemon')
)
const getPokémonId = compose(
  add(1),
  indexOf(POKÉDEX),
  toLowerCase
)
const rarePokéIds = compose(
  filter(gt(0)),
  map(getPokémonId)
)
const indexOfRarePokéId = compose(
  indexOf,
  rarePokéIds
)
const filterRarePokés = targets => compose(
  resolve,
  filter(
    compose(
      gt(-1),
      indexOfRarePokéId(targets),
      prop('pokemonId')
    )
  )
)
const mapRarePokés = (lat, lng) => compose(
  resolve,
  map(({
    latitude: _lat,
    longitude: _lng,
    pokemonId,
    uid,
    expiration_time
  }) => ({
    name: capitalize(POKÉDEX[pokemonId - 1]),
    id: pokemonId,
    uid: `${_lat},${_lng}`,
    dist: `${dist(lat, lng, _lat, _lng).toFixed(2)} km`,
    ttl: `${
      ((((expiration_time * 1000) - Date.now()) / 1000) / 60) << 0
    } min ${
      ((((expiration_time * 1000) - Date.now()) / 1000) % 60).toFixed(0)
    } sec`,
    refs: [
      `https://www.google.com/maps/dir/${lat},${lng}/${_lat},${_lng}`,
      `https://pokevision.com/#/@${_lat},${_lng}`
    ]
  }))
)
const reportRarePokés = (locationName, onFind) => compose(
  each(onFind),
  map(p => ({
    title: `Found Rare Pokémon!`,
    icon: 'https://pokevision.com/asset/image/logo-mini-light.png',
    contentImage: `https://ugc.pokevision.com/images/pokemon/${p.id}.png`,
    group: p.uid,
    message: `${p.name} is ${p.dist} away from ${locationName}, and will stick around for another ${p.ttl}`,
    open: p.refs[0]
  }))
)

const findRarePokésPlzNoSteal = ({ locationName, lat, lng, onFind, targets } = {}) => () => 
  fetch(`https://pokevision.com/map/data/${lat}/${lng}`)
    .then(handleErrors)
    .then(call('json'))
    .then(resolvePokés)
    .then(filterRarePokés(targets))
    .then(mapRarePokés(lat, lng))
    .then(reportRarePokés(locationName, onFind))
    .catch(console.error.bind(console))

module.exports = findRarePokésPlzNoSteal

