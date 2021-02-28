import React from 'react'


const BucketStates = ({chains}) => {

  if (chains.length) {
    return (
      <div id="bucket-state-zone">
        {chains.map( (chain, index) => {
          return(

            <div key={index} style={{marginTop: '1rem'}}>

            {(index>0
              ? <span style={{margin: '1rem'}}>another solution</span>   
              : <div/>
            )}

            <div className="bucket-state-line">
              <div className="one-cell">
                <span>Step</span>
              </div>
              <div className="one-cell">
                <span>X</span>
              </div>
              <div className="one-cell">
                <span>Y</span>
              </div>
            </div>
            <hr></hr>

            {chain.map( (bucketState, index) => {
              
              return (

                <div key={index} className="bucket-state-line">
                  <div className="one-cell">
                    <span>{bucketState.step}</span>
                  </div>
                  <div className="one-cell">
                    <span>{bucketState.X}</span>
                  </div>
                  <div className="one-cell">
                    <span>{bucketState.Y}</span>
                  </div>
                </div>
              )

            })}

            </div>
          )
        })}
      </div>
    )
  } else {
    return (
      <span>No solution</span>
    )
  }
}

export {BucketStates}