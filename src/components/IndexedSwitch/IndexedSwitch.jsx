import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Typography } from 'antd'
import Style from './Style'
import * as actions from '../../redux/actions/settings'

const { Text } = Typography

class IndexedSwitch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSwitching: false,
        }
    }

    switch(indexed) {
        const { isSwitching } = this.state
        const { settings, switchIndexed } = this.props
        if (isSwitching || indexed === settings.indexed) return
        switchIndexed(indexed)
        this.setState({ isSwitching: true })
        setTimeout(() => this.setState({ isSwitching: false }), 100)
    }

    render() {
        const { settings } = this.props
        const { isSwitching } = this.state

        return (
            <div style={Style.container}>
                <Text style={Style.text}>Данные индексированы:</Text>
                <Switch
                    loading={isSwitching}
                    checked={settings.indexed}
                    onChange={(value) => this.switch(value)}
                />
            </div>
        )
    }
}

IndexedSwitch.propTypes = {
    settings: PropTypes.object,
    switchIndexed: PropTypes.func.isRequired,
}

IndexedSwitch.defaultProps = {
    settings: {},
}

export default connect(
    (state) => ({
        settings: state.settings,
    }),
    (dispatch) => ({
        switchIndexed: (indexed) => dispatch(actions.switchIndexed(indexed)),
    })
)(IndexedSwitch)
