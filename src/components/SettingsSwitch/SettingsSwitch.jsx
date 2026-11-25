import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Style from './Style'
import IndexedSwitch from '../IndexedSwitch/IndexedSwitch'
import RegionSwitch from '../RegionSwitch/RegionSwitch'
import CiVersionSwitch from '../CiVersionSwitch/CiVersionSwitch'

class SettingsSwitch extends PureComponent {
    render() {
        const { switchIndexedEnabled, switchIsRegionEnabled, switchCiVersionEnabled } = this.props
        return (
            <div style={Style.container}>
                {switchIndexedEnabled ? <IndexedSwitch /> : undefined}
                {switchIsRegionEnabled ? <RegionSwitch /> : undefined}
                {switchCiVersionEnabled ? <CiVersionSwitch /> : undefined}
            </div>
        )
    }
}

SettingsSwitch.propTypes = {
    switchIndexedEnabled: PropTypes.bool,
    switchIsRegionEnabled: PropTypes.bool,
    switchCiVersionEnabled: PropTypes.bool,
}

SettingsSwitch.defaultProps = {
    switchIndexedEnabled: true,
    switchIsRegionEnabled: true,
    switchCiVersionEnabled: false,
}

export default SettingsSwitch
