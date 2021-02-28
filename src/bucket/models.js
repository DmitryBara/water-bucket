const Sequelize = require('sequelize')
const Serializer = require('sequelize-json-serializer')
const database = require('../db')


// Initial capacity of buckets X and Y
const BucketData = database.define(
  'bucket_data',
  {  
    capacityX: {
      type: Sequelize.SMALLINT
    }, 
    capacityY: {
      type: Sequelize.SMALLINT
    }
  },
  {
    indexes:[
      {
        unique: true,
        fields:['capacityX', 'capacityY']
      }
    ], 
    timestamps: false,
  }
);


// Different states which could be achieved while water move
const BucketState = database.define(
  'bucket_state',
  {
    stateX: {
      type: Sequelize.SMALLINT
    }, 
    stateY: {
      type: Sequelize.SMALLINT
    },
    parentNode: {
      type: Sequelize.INTEGER
    },
    depth: {
      type: Sequelize.INTEGER
    },
    nextStepCycled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    indexes:[
      {
        unique: true,
        fields:['stateX', 'stateY', 'bucketDataId']
      }
    ], 
    timestamps: false,
  }
);

BucketData.hasMany(BucketState, {
  allowNull: false,
  foreignKey: 'bucketDataId'
})


// Schemas
const BucketStateSchemaStraight = {    
  fields: {
    'depth': 'step',
    'stateX': 'X',
    'stateY': 'Y',
  },
  options: {
    excludePK: true
  }
}

const BucketStateSchemaReverse = {    
  fields: {
    'depth': 'step',
    'stateY': 'X',
    'stateX': 'Y',
  },
  options: {
    excludePK: true
  }
}

Serializer.defineSchema(BucketState , BucketStateSchemaStraight, 'straight') 
Serializer.defineSchema(BucketState , BucketStateSchemaReverse, 'reverse') 

module.exports = {BucketData, BucketState};
