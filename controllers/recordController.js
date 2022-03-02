const recordModel = require('../models/recordModel')
const cache = require('../utils/cache')

const CACHE_KEY = 'RECORD'


const asyncFunction = async (res, callback) => {
    cache.delete(CACHE_KEY)
    try {
        const data = await callback()
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error)
    }
}


const get = async (req, res) => {
    try {
        if (!cache.isExpired(CACHE_KEY)) return res.status(200).json(cache.get(CACHE_KEY).data)

        const data = await recordModel
        .find()
        .select({
            uniqid: 1,
            firstName: 1,
            lastName: 1,
        })
        .lean()
        .skip(res.startIndex)
        .limit(res.limit)

        res.status(200).json(data)
        cache.set(CACHE_KEY, data)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getOne = (req, res) => asyncFunction(res, () => recordModel.findOne({uniqid: req.params.id}))
const create = (req, res) => asyncFunction(res, () => recordModel.create(req.body))
const remove = (req, res) => asyncFunction(res, () => recordModel.findOneAndRemove({uniqid: req.params.id}))
const update = (req, res) => asyncFunction(res, () => recordModel.findOneAndUpdate({uniqid: req.params.id}, req.body, { new: true }))

module.exports = {
    get,
    getOne,
    create,
    remove,
    update
}