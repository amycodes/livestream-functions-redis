const { createClient } = require('redis')
const redis = (() => {
  const client = createClient({ url: process.env.REDIS_URL })
  client.connect()
  return client
})()

async function keys({ prefix = '' }) {
  return redis
    .keys(`${prefix}*`)
    .then(reply => ({ value: reply }))
    .catch(err => ({ error: 'Error retrieving all keys:' + err }))
}

async function set({ key, value }) {
  if (!key || !value) {
    return { error: 'Please specify a non-empty key and value' }
  }

  return redis
    .set(key, value)
    .then(reply => ({ value: reply }))
    .catch(err => ({ error: 'Error setting value for key ' + key }))
}

async function get({ key }) {
  if (!key) {
    return { error: 'Please specify a non-empty key' }
  }

  return redis
    .get(key)
    .then(reply => ({ value: reply }))
    .catch(err => ({ error: 'Error retrieving value for key ' + key }))
}

async function del({ key }) {
  if (!key) {
    return { error: 'Please specify a non-empty key' }
  }

  return redis
    .del(key)
    .then(reply => ({ value: reply }))
    .catch(err => ({ error: 'Error deleting key ' + key }))
}


async function ttl({ key }) {
  if (!key) {
    return { error: 'Please specify a non-empty key' }
  }

  return redis
    .ttl(key)
    .then(ttl => {
      if (ttl >= 0) {
        return { value: ttl }
      } else if (ttl == -1) {
        return { error: `Key ${key} exists but has no associated expiration` }
      } else if (ttl == -2) {
        return { error: `Key ${key} does not exist` }
      } else {
        return { error: `Error retrieving ttl for key ${key}` }
      }
    })
    .catch(err => ({ error: `Error retrieving ttl for key ${key}` }))
}

async function expire({ key, ttl }) {
  const ttlValue = parseInt(ttl)
  if (!key) {
    return { error: 'Please specify a non-empty key' }
  } else if (ttlValue < 0 || !Number.isInteger(ttlValue)) {
    return { error: 'Please specify a positive value for expiration in seconds' }
  }

  return redis
    .expire(key, ttlValue)
    .then(reply => ({ value: reply }))
    .catch(err => ({ error: `Error setting expiration for key ${key}` }))
}

async function flush(args) {
  if (args && args.flush) {
    return redis
      .flushAll('ASYNC')
      .then(_ => ({ value: true }))
      .catch(err => {
        console.log(err)
        return { error: 'Error while flushing keys' }
      })
  } else {
    return {
      value: false
    }
  }
}

exports.main = async args => {
  const commands = {
    keys: keys,
    set: set,
    get: get,
    del: del,
    expire: expire,
    ttl: ttl,
    flush: flush
  }

  const c = commands[args.c || args.cmd || args.command]
  return c ? c(args) : ({ error: 'command not recognized' })
}

if (process.env.TEST) {
  exports.main({c: 'flush', flush: true}).then(console.log).catch(console.log)
  redis.quit()
}
