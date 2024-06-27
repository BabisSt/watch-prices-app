import React from 'react'
import { connect } from 'react-redux'

export const home = (props) => {
  return (
    <div>home</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(home)