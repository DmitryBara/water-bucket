const request = require('supertest')
const app  = require('../app')
const database = require('../db')
const { BucketData, BucketState } = require('./models.js')

describe('Post to /bucket/check', () => {

  let thisDb = database
  const url = '/api/bucket/check'

  beforeEach(async () => {
    await thisDb.sync({ force: true })
  })

  //
  // regular test straight direction (X>=Y)
  //
  it('TestCase 1: (10, 2, 4)', async () => {
    const res = await request(app)
      .post(url)
      .send({
        X: 10,
        Y: 2,
        Z: 4,
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.chains.length).toEqual(1)
    expect(res.body.chains[0].length).toEqual(4)
    
    expectedChain = [{
        "step": 1,
        "X": 0,
        "Y": 2
    },
    {
        "step": 2,
        "X": 2,
        "Y": 0
    },
    {
        "step": 3,
        "X": 2,
        "Y": 2
    },
    {
        "step": 4,
        "X": 4,
        "Y": 0
    }]

    expect(res.body.chains[0]).toEqual(expectedChain)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(10)
  })

  //
  // same test reverse direction (X<Y)
  //
  it('TestCase 2: (2, 10, 4)', async () => {
    const res = await request(app)
    .post(url)
      .send({
        X: 2,
        Y: 10,
        Z: 4,
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.chains.length).toEqual(1)
    expect(res.body.chains[0].length).toEqual(4)
    const expectedChain = [{
        "step": 1,
        "X": 2,
        "Y": 0
    },
    {
        "step": 2,
        "X": 0,
        "Y": 2
    },

    {
        "step": 3,
        "X": 2,
        "Y": 2
    },
    {
        "step": 4,
        "X": 0,
        "Y": 4
    }]
    expect(res.body.chains[0]).toEqual(expectedChain)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(10)
  })

  //
  // three requests step by step in deep 
  // 
  it('TestCase 3: (13, 4, 7), (4, 13, 11), (4, 13, 15)', async () => {

    // process until find first match on level 12
    const resFirst = await request(app)
    .post(url)
      .send({
        X: 13,
        Y: 4,
        Z: 7,
      })
    expect(resFirst.statusCode).toEqual(200)
    expect(resFirst.body.chains.length).toEqual(1)
    expect(resFirst.body.chains[0].length).toEqual(12)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(26)

    // continue processing until find match on level 14
    const resSecond = await request(app)
    .post(url)
      .send({
        X: 4,
        Y: 13,
        Z: 11,
      })
    expect(resSecond.statusCode).toEqual(200)
    expect(resSecond.body.chains.length).toEqual(1)
    expect(resSecond.body.chains[0].length).toEqual(14)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(30)

    // process untill finish on level 
    const resThird = await request(app)
    .post(url)
    .send({
      X: 4,
      Y: 13,
      Z: 15,
    })
    expect(resThird.statusCode).toEqual(200)
    expect(resThird.body.chains.length).toEqual(0)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(34)
    var maxDepth = await BucketState.max('depth')
    var deepestBucketStates = await BucketState.findAll({ where: { depth: maxDepth }})

    for (bucketState of deepestBucketStates) {
      expect(bucketState.nextStepCycled).toBe(true)
    }
    var allBucketData = await BucketData.findAll()
    expect(allBucketData.length).toEqual(1)
  })

  //
  // two requests but first deeper (same data as previous test)
  //
  it('TestCase 4: (4, 13, 11), (4, 13, 7)', async () => {

    // process until find first match on level 14
    const resFirst = await request(app)
    .post(url)
      .send({
        X: 4,
        Y: 13,
        Z: 11,
      })
    expect(resFirst.statusCode).toEqual(200)
    expect(resFirst.body.chains.length).toEqual(1)
    expect(resFirst.body.chains[0].length).toEqual(14)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(30)

    // not processing (just get data from database on level 12)
    const resSecond = await request(app)
    .post(url)
      .send({
        X: 4,
        Y: 13,
        Z: 7,
      })
    expect(resSecond.statusCode).toEqual(200)
    expect(resSecond.body.chains.length).toEqual(1)
    expect(resSecond.body.chains[0].length).toEqual(12)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(30)
  })

  //
  // test case with 2 chains on one depth level
  //
  it('TestCase 5: (5, 5, 5)', async () => {
    const res = await request(app)
    .post(url)
      .send({
        X: 5,
        Y: 5,
        Z: 5,
      })
    expect(res.statusCode).toEqual(200)
    var allBucketData = await BucketData.findAll()
    expect(allBucketData.length).toEqual(1)
    expect(res.body.chains[0].length).toEqual(1)
    expect(res.body.chains[1].length).toEqual(1)
    var bucketStatesAll = await BucketState.findAll()
    expect(bucketStatesAll.length).toEqual(3)
  })

  //
  // test case with 3 different Bucket Data (one is not valid)
  //
  it('TestCase 6: (8, 17, 3), (8, 15, 6), (15, 17, 1000)', async () => {

    const resFirst = await request(app)
    .post(url)
      .send({
        X: 8,
        Y: 17,
        Z: 3,
      })
    expect(resFirst.statusCode).toEqual(200)
    expect(resFirst.body.chains.length).toEqual(1)
    var bucketStatesObjectsAfterFirst = await BucketState.findAll()
    var bucketDataObjectsAfterFirst = await BucketData.findAll()
    expect(bucketDataObjectsAfterFirst.length).toEqual(1)

    const resSecond = await request(app)
    .post(url)
    .send({
      X: 8,
      Y: 15,
      Z: 6,
    })
    expect(resSecond.statusCode).toEqual(200)
    expect(resSecond.body.chains.length).toEqual(1)
    var bucketStatesObjectsAfterSecond = await BucketState.findAll()
    var bucketDataObjectsAfterSecond = await BucketData.findAll()
    expect(bucketDataObjectsAfterSecond.length).toEqual(2)

    const resThird = await request(app)
    .post(url)
    .send({
      X: 15,
      Y: 17,
      Z: 1000,
    })
    expect(resThird.statusCode).toEqual(400)
    var bucketStatesObjectsAfterThird = await BucketState.findAll()
    var bucketDataObjectsAfterThird = await BucketData.findAll()

    expect(bucketStatesObjectsAfterSecond.length > bucketStatesObjectsAfterFirst.length).toBe(true)
    expect(bucketStatesObjectsAfterThird).toEqual(bucketStatesObjectsAfterSecond)
    expect(bucketDataObjectsAfterThird.length).toEqual(2)
  })


  afterAll(async () => {
    await thisDb.close()
  })
})