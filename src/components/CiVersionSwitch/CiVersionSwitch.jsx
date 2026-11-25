import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Radio, Typography } from 'antd'
import Style from './Style'
import * as actions from '../../redux/actions/settings'

const { Text } = Typography

class CiVersionSwitch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSwitching: false,
        }
    }

    switch(version) {
        const { isSwitching } = this.state
        const { settings, switchCiVersion } = this.props
        if (isSwitching || version === settings.ciVersion) return
        switchCiVersion(version)
        this.setState({ isSwitching: true })
        setTimeout(() => this.setState({ isSwitching: false }), 100)
    }

    render() {
        const { settings } = this.props

        return (
            <div style={Style.container}>
                <Text style={Style.text}>Версия данных:</Text>
                <Radio.Group
                    options={[
                        { label: 'Старые', value: 'old' },
                        { label: 'Новые', value: 'new' },
                    ]}
                    onChange={({ target }) => this.switch(target.value)}
                    value={settings.ciVersion}
                    optionType='button'
                />
            </div>
        )
    }
}

CiVersionSwitch.propTypes = {
    settings: PropTypes.object,
    switchCiVersion: PropTypes.func.isRequired,
}

CiVersionSwitch.defaultProps = {
    settings: {},
}

export default connect(
    (state) => ({
        settings: state.settings,
    }),
    (dispatch) => ({
        switchCiVersion: (ciVersion) => dispatch(actions.switchCiVersion(ciVersion)),
    })
)(CiVersionSwitch)
