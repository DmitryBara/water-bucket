const { BucketData, BucketState } = require("./models")


const saveNewBucketState = async function(newStateX, newStateY, fromBucketState, bucketData) {

  if (newStateX == fromBucketState.stateX && newStateY == fromBucketState.stateY) {
    return null
  }

  alreadyExistBucketState = await BucketState.findOne({
    where: { 
      stateX: newStateX, 
      stateY: newStateY, 
      bucketDataId: bucketData.id
    }
  })

  if (!alreadyExistBucketState) {
    newBucketState = await BucketState.create({ stateX: newStateX, stateY: newStateY, parentNode: fromBucketState.id, bucketDataId: bucketData.id, depth: fromBucketState.depth + 1})
    return newBucketState
  }
}


const fullX = function(fromBucketState, bucketData) {
  var newStateX = bucketData.capacityX
  var newStateY = fromBucketState.stateY
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}

const fullY = function(fromBucketState, bucketData) {
  var newStateX = fromBucketState.stateX
  var newStateY = bucketData.capacityY
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}

const dropX = function(fromBucketState, bucketData) {
  var newStateX = 0
  var newStateY = fromBucketState.stateY
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}

const dropY = function(fromBucketState, bucketData) {
  var newStateX = fromBucketState.stateX
  var newStateY = 0
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}

const fromXtoY = function(fromBucketState, bucketData) {
  var newValueForY = fromBucketState.stateX + fromBucketState.stateY
  if (newValueForY <= bucketData.capacityY) {
    var newStateX = 0
    var newStateY = newValueForY
  } else {
    var newStateX = fromBucketState.stateX - (bucketData.capacityY - fromBucketState.stateY)
    var newStateY = bucketData.capacityY
  }
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}

const fromYtoX = function(fromBucketState, bucketData) {
  var newValueForX = fromBucketState.stateY + fromBucketState.stateX
  if (newValueForX <= bucketData.capacityX) {
    var newStateX = newValueForX
    var newStateY = 0
  } else {
    var newStateX = bucketData.capacityX
    var newStateY = fromBucketState.stateY - (bucketData.capacityX - fromBucketState.stateX)
  }
  return saveNewBucketState(newStateX, newStateY, fromBucketState, bucketData)
}


const makeAllAvailableOperations = async function(bucketState) {

  bucketData = await BucketData.findOne({ where: { id: bucketState.bucketDataId} })
  var listOfCreatedNewBucketStateInstances = []

  listOfCreatedNewBucketStateInstances.push(await dropX(bucketState, bucketData))
  listOfCreatedNewBucketStateInstances.push(await dropY(bucketState, bucketData))
  listOfCreatedNewBucketStateInstances.push(await fullX(bucketState, bucketData))
  listOfCreatedNewBucketStateInstances.push(await fullY(bucketState, bucketData))
  listOfCreatedNewBucketStateInstances.push(await fromXtoY(bucketState, bucketData))
  listOfCreatedNewBucketStateInstances.push(await fromYtoX(bucketState, bucketData))

  var allBucketStatesFromCurrentState = listOfCreatedNewBucketStateInstances.filter(newBucketStateInstance => !!newBucketStateInstance)

  if (allBucketStatesFromCurrentState.length == 0) {
    await bucketState.update({ nextStepCycled: true })
  }
  return allBucketStatesFromCurrentState

}

module.exports = {makeAllAvailableOperations}