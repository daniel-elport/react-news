import React from 'react'
import Header from './Header'
import { useNewsGate } from '../hooks/useNewsGate'
import LoadingSpinner from './LoadingSpinner'

const Layout = ({ children }: { children: JSX.Element }) => {
    const { ready, ref } = useNewsGate()

    return (
        <div>
            <Header />
            <div ref={ref} />
            <div className="container white-bg main-container px-sm-4">
                <div className="pt-2 pt-lg-3">
                    {ready ? children : <LoadingSpinner />}
                </div>
            </div>
        </div>
    )
}

export default Layout
