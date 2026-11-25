import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Radio, Typography } from 'antd'
import Style from './Style'
import * as actions from '../../redux/actions/settings'

const { Text } = Typography

class RegionSwitch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSwitching: false,
        }
    }

    switch(isRegion) {
        const { isSwitching } = this.state
        const { settings, switchIsRegion } = this.props
        if (isSwitching || isRegion === settings.isRegion) return
        switchIsRegion(isRegion)
        this.setState({ isSwitching: true })
        setTimeout(() => this.setState({ isSwitching: false }), 100)
    }

    render() {
        const { settings } = this.props

        return (
            <div style={Style.container}>
                <Text style={Style.text}>Данные по:</Text>
                <Radio.Group
                    options={[
                        { label: 'Городам', value: 'city' },
                        { label: 'Регионам', value: 'region' },
                    ]}
                    onChange={({ target }) => this.switch(target.value === 'region')}
                    value={settings.isRegion ? 'region' : 'city'}
                    optionType='button'
                />
            </div>
        )
    }
}

RegionSwitch.propTypes = {
    settings: PropTypes.object,
    switchIsRegion: PropTypes.func.isRequired,
}

RegionSwitch.defaultProps = {
    settings: {},
}

export default connect(
    (state) => ({
        settings: state.settings,
    }),
    (dispatch) => ({
        switchIsRegion: (isRegion) => dispatch(actions.switchIsRegion(isRegion)),
    })
)(RegionSwitch)
