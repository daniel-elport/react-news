import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import FeedPage from '../pages/FeedPage'
import Article from '../pages/ArticlePage'
import Layout from './Layout'
import { useNewsGate } from '../hooks/useNewsGate'
import LoadingSpinner from './LoadingSpinner'

const AppRouter = () => {
    const { ready, ref } = useNewsGate()

    return (
        <>
            <div ref={ref} />
            {ready ? <Router>
                <Layout>
                    <Switch>
                        <Route
                            path="/"
                            exact
                            component={() => <Redirect to="/section/latest" />}
                        />
                        <Route
                            path="/search/:searchTerm"
                            exact
                            component={FeedPage}
                        />
                        <Route
                            path="/section/:section"
                            exact
                            component={FeedPage}
                        />
                        <Route path="/article/:id+" component={Article} />
                        <Route component={() => <Redirect to="/" />} />
                    </Switch>
                </Layout>
            </Router> : <LoadingSpinner />}
        </>
    )
}

export default AppRouter
