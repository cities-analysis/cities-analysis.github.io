import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Style from './Style'
import LinkDiv from '../LinkDiv/LinkDiv'
import NavigationUtils from '../../utils/NavigationUtils'
/* eslint-disable-next-line import/named */
import { URL as HomeURL } from '../../pages/Home/Home'
// import { URL as AnalysisURL } from '../../pages/Analysis/Analysis'
import { URL as ChartsURL } from '../../pages/Charts/Charts'
import { URL as CI_URL } from '../../pages/CI/CI'
import { URL as DataURL, URL_OLD as DataOldUrl } from '../../pages/Data/Data'
import { URL as MapURL } from '../../pages/Map/Map'
import { URL as NewMapURL } from '../../pages/NewMap/NewMap'
import { SERVER } from '../../constants'
/* eslint-disable-next-line import/named */

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMapHovered: false,
            isNewMapHovered: false,
            isChartsHovered: false,
            // isAnalysisHovered: false,
            isCIHovered: false,
            isDataUploadHovered: false,
            isMapActive: false,
            isNewMapActive: false,
            isChartsActive: false,
            // isAnalysisActive: false,
            isCIActive: false,
            isDataUploadActive: false,
        }
    }

    async componentDidMount() {
        this.updateActiveTab()
        await fetch(SERVER)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            JSON.stringify({ path: this.props.location?.path }) !==
            JSON.stringify({ path: prevProps.location?.path })
        )
            this.updateActiveTab()
    }

    updateActiveTab() {
        let currentPath = this.props.location?.path
        if (currentPath?.length === 0) currentPath = NavigationUtils.getPath()
        if (currentPath?.length === 0) {
            this.setState({
                isMapActive: false,
                isNewMapActive: false,
                isChartsActive: false,
                // isAnalysisActive: false,
                isCIActive: false,
                isDataUploadActive: false,
            })
        } else {
            this.setState({
                isMapActive: currentPath.some((path) => path === MapURL),
                isNewMapActive: currentPath.some((path) => path === NewMapURL),
                isChartsActive: currentPath.some((path) => path === ChartsURL),
                // isAnalysisActive: currentPath.some((path) => path === AnalysisURL),
                isCIActive: currentPath.some((path) => path === CI_URL),
                isDataUploadActive: currentPath.some(
                    (path) => path === DataURL || path === DataOldUrl
                ),
            })
        }
    }

    render() {
        return (
            <div style={Style.container}>
                <div style={Style.home}>
                    <LinkDiv to={HomeURL}>
                        <a style={Style.title} href={HomeURL}>
                            Сравнительный потенциал креативной реиндустриализации городов второго
                            эшелона
                        </a>
                    </LinkDiv>
                </div>
                <div
                    style={
                        this.state.isMapHovered || this.state.isMapActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isMapHovered: true })}
                    onMouseLeave={() => this.setState({ isMapHovered: false })}
                >
                    <LinkDiv to={MapURL}>
                        <a style={Style.text} href={MapURL}>
                            Карта экономических показателей
                        </a>
                    </LinkDiv>
                </div>
                <div
                    style={
                        this.state.isNewMapHovered || this.state.isNewMapActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isNewMapHovered: true })}
                    onMouseLeave={() => this.setState({ isNewMapHovered: false })}
                >
                    <LinkDiv to={NewMapURL}>
                        <a style={Style.text} href={NewMapURL}>
                            Карта пространственного развития
                        </a>
                    </LinkDiv>
                </div>
                <div
                    style={
                        this.state.isChartsHovered || this.state.isChartsActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isChartsHovered: true })}
                    onMouseLeave={() => this.setState({ isChartsHovered: false })}
                >
                    <LinkDiv to={ChartsURL}>
                        <a style={Style.text} href={ChartsURL}>
                            Динамика показателей
                        </a>
                    </LinkDiv>
                </div>
                {/* <div
                    style={
                        this.state.isAnalysisHovered || this.state.isAnalysisActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isAnalysisHovered: true })}
                    onMouseLeave={() => this.setState({ isAnalysisHovered: false })}
                >
                    <LinkDiv to={AnalysisURL}>
                        <a style={Style.text} href={AnalysisURL}>Анализ</p>
                    </LinkDiv>
                </div> */}
                <div
                    style={
                        this.state.isCIHovered || this.state.isCIActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isCIHovered: true })}
                    onMouseLeave={() => this.setState({ isCIHovered: false })}
                >
                    <LinkDiv to={CI_URL}>
                        <a style={Style.text} href={CI_URL}>
                            Дашборды креативных индустрий
                        </a>
                    </LinkDiv>
                </div>
                <div
                    style={
                        this.state.isDataUploadHovered || this.state.isDataUploadActive
                            ? Style.buttonHovered
                            : Style.button
                    }
                    onMouseEnter={() => this.setState({ isDataUploadHovered: true })}
                    onMouseLeave={() => this.setState({ isDataUploadHovered: false })}
                >
                    <LinkDiv to={DataURL}>
                        <a style={Style.text} href={DataURL}>
                            Данные
                        </a>
                    </LinkDiv>
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    location: PropTypes.object,
}

Header.defaultProps = {
    location: {},
}

export default connect(
    (state) => ({
        location: state.location,
    }),
    undefined
)(Header)
