import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Style from './Style'
import IndexedSwitch from '../IndexedSwitch/IndexedSwitch'
import RegionSwitch from '../RegionSwitch/RegionSwitch'

class SettingsSwitch extends PureComponent {
    render() {
        const { switchIndexedEnabled, switchIsRegionEnabled } = this.props
        return (
            <div style={Style.container}>
                {switchIndexedEnabled ? <IndexedSwitch /> : undefined}
                {switchIsRegionEnabled ? <RegionSwitch /> : undefined}
            </div>
        )
    }
}

SettingsSwitch.propTypes = {
    switchIndexedEnabled: PropTypes.bool,
    switchIsRegionEnabled: PropTypes.bool,
}

SettingsSwitch.defaultProps = {
    switchIndexedEnabled: true,
    switchIsRegionEnabled: true,
}

export default SettingsSwitch
