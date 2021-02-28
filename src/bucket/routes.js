const { Router } = require('express')
const { validate } = require('express-validation')
const Serializer = require("sequelize-json-serializer");  
const { Op } = require('Sequelize');
const router = Router()
const { BucketData, BucketState } = require('./models.js')
const { BucketValidation } = require('./validators')
const { getAllChainsFromBase, processBucketStatesInstancesUntillGetShortestChains, getBucketStatesWithMaximumDepthAndNotFinished, getBucketStatesWithMinimumDepth } = require('./helpers')


router.post('/check', validate(BucketValidation, {}, {}), async(req, res) => {
  
    var {X, Y, Z} = req.body

    var stateXandY = 'straight'
    if (X < Y) {
      [X, Y] = [Y, X]
      stateXandY = 'reverse'
    }

    var allChains = []

    bucketData = await BucketData.findOne({
      where:
        { capacityX: X, capacityY:Y }
    })

    if (bucketData) {

      relevantBucketStates = await BucketState.findAll({
        where: {
          bucketDataId: bucketData.id,
          [Op.or]: [{stateX: Z}, {stateY: Z}],
        }
      })

      if (relevantBucketStates.length != 0) {
        relevantBucketStates = getBucketStatesWithMinimumDepth(relevantBucketStates)
        allChains = await getAllChainsFromBase(relevantBucketStates)
      
      } else {
        var relevantBucketStates = await BucketState.findAll({ 
          where: {
            bucketDataId: bucketData.id,
          }
        })
        notFinishedBucketStates = getBucketStatesWithMaximumDepthAndNotFinished(relevantBucketStates)
        allChains = await processBucketStatesInstancesUntillGetShortestChains(notFinishedBucketStates, Z)
      }
      
    } else {
      const bucketData = await BucketData.create({ capacityX: X, capacityY:Y });
      const initialBucketState = await BucketState.create({ stateX: 0, stateY: 0, parentNode: 0, bucketDataId: bucketData.id, depth: 0})
      allChains = await processBucketStatesInstancesUntillGetShortestChains([initialBucketState], Z)
    }
    
    var allChainsSerialized = []
    for (chain of allChains) {
      serializedChain = await Serializer.serialize(chain, BucketState, {tags: [stateXandY]})
      allChainsSerialized.push(serializedChain)
    }
    res.status(200).json({
      chains: allChainsSerialized
    })
})


module.exports = router