import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import cl from 'classnames'
import './index.scss'

interface CustomScrollProps {
  className?: string
  style?: any
  onScroll?: any
  children?: React.ReactNode
  toTop?: any
  id?: string
}

const CustomScroll: React.FC<CustomScrollProps> = (props) => {
  const { className, onScroll, style = {}, toTop, children, id } = props
  const scorllRef = useRef(null)
  const timeRef = useRef<any>(null)
  const [isScorll, setIsScroll] = useState<boolean>(false)
  const customScroll = (ev: any) => {
    ev.preventDefault()
    setIsScroll(true)
    timeRef.current && clearTimeout(timeRef.current)
    timeRef.current = setTimeout(() => {
      setIsScroll(false)
    }, 1000)
  }
  useEffect(() => {
    if (scorllRef.current) {
      scorllRef.current.scrollTop = '0px'
    }
  }, [toTop])
  useEffect(() => {
    scorllRef?.current?.addEventListener('scroll', customScroll)
    return () => {
      scorllRef?.current?.removeEventListener('scroll', customScroll)
      timeRef.current && clearTimeout(timeRef.current)
    }
  }, [])
  const _onScroll = () => {
    onscroll && onScroll()
  }

  return (
    <div
      className={cl('custom-scroll', isScorll ? 'custom-scrolling' : '', className)}
      ref={scorllRef}
      style={style}
      {...(id ? { id } : {})}
      onScroll={_onScroll}
    >
      {children ? children : null}
    </div>
  )
}
export default CustomScroll
