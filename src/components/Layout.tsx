import React from 'react'
import Header from './Header'
import { useNewsGate } from '../hooks/useNewsGate'

const Layout = ({ children }: { children: JSX.Element }) => {
  const { ready, ref } = useNewsGate()

  if (!ready) {
    return (
      <div className="turnstile-gate">
        <div className="turnstile-gate__box">
          <h1 className="turnstile-gate__title">React News</h1>
          <p className="turnstile-gate__text">
            Please confirm you are a human.
          </p>
          <div ref={ref} className="turnstile-gate__widget" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="container white-bg main-container px-sm-4">
        <div className="pt-2 pt-lg-3">{children}</div>
      </div>
    </div>
  )
}

export default Layout