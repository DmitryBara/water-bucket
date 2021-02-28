 const { makeAllAvailableOperations } = require('./waterOperations')
 const { BucketState } = require('./models.js')


const getAllChainsFromBase = async function(relevantBucketStates) {
  var allChains = []
  for (bucketState of relevantBucketStates) {
    var chain = []
    while (bucketState.parentNode != 0) {
      chain.push(bucketState)
      var bucketState = await BucketState.findOne({ where: { id: bucketState.parentNode }})
    }
    allChains.push(chain.reverse())
  }
  return allChains
}


const processBucketStatesInstancesOneStepInDepth = async function(notFinishedBucketStates, wantedZ) {

  var notFinishedBucketStatesForNextStep = []
  var relevantBucketStates = []
  
  for (bucketState of notFinishedBucketStates) {

    var allBucketStatesFromCurrentState = await makeAllAvailableOperations(bucketState)

    for (oneBucketStateFromCurrentState of allBucketStatesFromCurrentState) {
      if (oneBucketStateFromCurrentState.stateX == wantedZ || oneBucketStateFromCurrentState.stateY == wantedZ) {
        relevantBucketStates.push(oneBucketStateFromCurrentState) //
      }
      if (relevantBucketStates.length == 0 && !oneBucketStateFromCurrentState.nextStepCycled) {
        notFinishedBucketStatesForNextStep.push(oneBucketStateFromCurrentState)
      }
    }
  }
  return {notFinishedBucketStates: notFinishedBucketStatesForNextStep, relevantBucketStates}
}


const processBucketStatesInstancesUntillGetShortestChains = async function(notFinishedBucketStates, wantedZ) {

  do {
    var {notFinishedBucketStates, relevantBucketStates} = await processBucketStatesInstancesOneStepInDepth(notFinishedBucketStates, wantedZ)
  } while (notFinishedBucketStates.length != 0 && relevantBucketStates.length == 0)

  allChains = await getAllChainsFromBase(relevantBucketStates)
  return allChains
}


const getBucketStatesWithMaximumDepthAndNotFinished = function (bucketStates) {
  var maximumDepth = 0
  for (bucketState of bucketStates) {
    if (bucketState.depth > maximumDepth) {
      maximumDepth = bucketState.depth
    }
  }
  return bucketStates.filter(element => (element.depth == maximumDepth  && !element.nextStepCycled))
}

const getBucketStatesWithMinimumDepth = function (bucketStates) {
  var minimumDepth = bucketStates[0].depth
  for (bucketState of bucketStates.slice(1)) {
    if (bucketState.depth < minimumDepth) {
      minimumDepth = bucketState.depth
    }
  }
  return bucketStates.filter(element => (element.depth == minimumDepth))
}

module.exports = {getAllChainsFromBase, processBucketStatesInstancesUntillGetShortestChains, getBucketStatesWithMaximumDepthAndNotFinished, getBucketStatesWithMinimumDepth}
