const Cache = new Map()

const CACHE_EXPIRATION = 5000 //milliseconds

module.exports.has = (key) => {
    return Cache.has(key)
}

module.exports.get = (key) => {
    return Cache.get(key)
}

module.exports.set = (key, data) => {
    return Cache.set(key, { data, timeStamp: Date.now() })
}

module.exports.delete = (key) => {
    return Cache.delete(key)
}

module.exports.clear = (key) => {
    return Cache.clear(key)
}

module.exports.isExpired = (key) => {

    if (Cache.has(key)) {
        const { data, timeStamp } = Cache.get(key)
        return (Date.now() - timeStamp) >= CACHE_EXPIRATION
    }

    return true
}