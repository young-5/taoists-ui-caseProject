import React from 'react'
import CustomScroll from '../components/CustomScroll'
import './CustomScroll.less'

/**
 * Primary UI component for user interaction
 */
export const Y5CustomScroll = () => {
  return (
    <CustomScroll className={'ppp'}>
      <div>header</div>
      <div className={'children'}></div>
      <div>footer</div>
    </CustomScroll>
  )
}
