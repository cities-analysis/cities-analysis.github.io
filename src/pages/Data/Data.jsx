import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Style from './Style'
import * as actions from '../../redux/actions/calculations'
import CalculationsTable from '../../components/CalculationsTable/CalculationsTable'
import SettingsSwitch from '../../components/SettingsSwitch/SettingsSwitch'
import pagesState from '../pagesState'

export const URL = 'data'

export const URL_OLD = 'data_upload'

class Data extends PureComponent {
    render() {
        const {
            settings,
            regions,
            cities,
            cityYears,
            regionYears,
            calculations,
            getCities,
            getRegions,
            getYears,
            getCalculations,
        } = this.props
        return (
            <div>
                <SettingsSwitch />
                <div style={Style.dataUpload}>
                    <CalculationsTable
                        settings={settings}
                        regions={regions}
                        cities={cities}
                        cityYears={cityYears}
                        regionYears={regionYears}
                        calculations={calculations}
                        getCities={getCities}
                        getRegions={getRegions}
                        getYears={getYears}
                        getCalculations={getCalculations}
                    />
                </div>
            </div>
        )
    }
}

Data.propTypes = {
    settings: PropTypes.object,
    cities: PropTypes.object,
    regions: PropTypes.object,
    cityYears: PropTypes.object,
    regionYears: PropTypes.object,
    calculations: PropTypes.object,
    getCities: PropTypes.func.isRequired,
    getRegions: PropTypes.func.isRequired,
    getYears: PropTypes.func.isRequired,
    getCalculations: PropTypes.func.isRequired,
}

Data.defaultProps = {
    settings: {},
    regions: {},
    cities: {},
    cityYears: {},
    regionYears: {},
    calculations: {},
}

export default connect(
    (state) => ({
        settings: state.settings,
        cities: state.calculations[pagesState.DATA_PAGE]?.cities,
        regions: state.calculations[pagesState.DATA_PAGE]?.regions,
        cityYears: state.calculations[pagesState.DATA_PAGE]?.cityYears,
        regionYears: state.calculations[pagesState.DATA_PAGE]?.regionYears,
        calculations: state.calculations[pagesState.DATA_PAGE]?.calculations,
    }),
    (dispatch) => ({
        getCities: () => dispatch(actions.getCities(pagesState.DATA_PAGE)),
        getRegions: () => dispatch(actions.getRegions(pagesState.DATA_PAGE)),
        getYears: (isRegion) => dispatch(actions.getYears(pagesState.DATA_PAGE, isRegion)),
        getCalculations: (year, city, region, isRegion) =>
            dispatch(actions.getCalculations(year, city, region, pagesState.DATA_PAGE, isRegion)),
    })
)(Data)
