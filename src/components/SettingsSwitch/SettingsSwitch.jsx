import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Style from './Style'
import IndexedSwitch from '../IndexedSwitch/IndexedSwitch'
import RegionSwitch from '../RegionSwitch/RegionSwitch'
import CiVersionSwitch from '../CiVersionSwitch/CiVersionSwitch'

class SettingsSwitch extends PureComponent {
    render() {
        const { switchIndexedEnabled, switchIsRegionEnabled, switchCiVersionEnabled, inline } =
            this.props
        return (
            <div style={inline ? Style.containerInline : Style.container}>
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
    inline: PropTypes.bool,
}

SettingsSwitch.defaultProps = {
    switchIndexedEnabled: true,
    switchIsRegionEnabled: true,
    switchCiVersionEnabled: false,
    inline: false,
}

export default SettingsSwitch
