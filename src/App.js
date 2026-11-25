import React, { PureComponent } from 'react'
import 'antd/dist/antd'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home, { URL as HomeURL } from './pages/Home/Home'
import Analysis, { URL as AnalysisURL } from './pages/Analysis/Analysis'
import Charts, { URL as ChartsURL } from './pages/Charts/Charts'
import CI, { URL as CI_URL } from './pages/CI/CI'
import Map, { URL as MapURL } from './pages/Map/Map'
import NewMap, { URL as NewMapURL } from './pages/NewMap/NewMap'
import Header from './components/Header/Header'
import NavigationListener from './components/NavigationListener/NavigationListener'

class App extends PureComponent {
    render() {
        return (
            <Router>
                <NavigationListener />
                <Header />
                <div className='page_container'>
                    <Routes>
                        <Route path={MapURL} element={<Map />} />
                        <Route path={NewMapURL} element={<NewMap />} />
                        <Route path={ChartsURL} element={<Charts />} />
                        <Route path={AnalysisURL} element={<Analysis />} />
                        <Route path={CI_URL} element={<CI />} />
                        {/* <Route path={'*'} element={<Home />} /> */}
                        {['*', HomeURL].map((path) => (
                            <Route path={path} element={<Home />} key={path} />
                        ))}
                    </Routes>
                </div>
            </Router>
        )
    }
}

export default App
