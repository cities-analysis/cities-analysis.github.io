import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Column, Line } from '@ant-design/plots'
import { Select, Space, Typography, Switch } from 'antd'
import { StyleRoot } from 'radium'
import Style from './Style'
import * as actions from '../../redux/actions/calculations'
import { convertNumber } from '../../utils/CommonConverter'
import { PARAMETERS } from '../../constants'
import SelectParameter from '../../components/SelectParameter/SelectParameter'
import SettingsSwitch from '../../components/SettingsSwitch/SettingsSwitch'
import pagesState from '../pagesState'

const { Text } = Typography

export const URL = 'charts'

class Charts extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedYears: undefined,
            selectedCities: undefined,
            filteredCalculations: [],
            selectedParameter: PARAMETERS[0].id,
            parameterPostfix: PARAMETERS[0].postfix,
            isLineChart: false,
            isMultiParams: false,
            selectedMultiParameters: [PARAMETERS[0].id],
            multiParametersCity: undefined,
        }
    }

    componentDidMount() {
        const { getYears, getCities, getCalculationsForChart } = this.props
        getYears()
        getCities()
        getCalculationsForChart(PARAMETERS[0].id)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { years, cities, calculations, settings, getCalculationsForChart } = this.props
        let { selectedYears, selectedCities } = this.state
        const {
            filteredCalculations,
            isMultiParams,
            multiParametersCity,
            selectedMultiParameters,
        } = this.state
        if (settings.indexed !== prevProps.settings.indexed) {
            const { selectedParameter } = this.state
            this.setState({ filteredCalculations: [] })
            getCalculationsForChart(
                isMultiParams ? selectedMultiParameters : selectedParameter,
                isMultiParams,
                multiParametersCity
            )
        }
        const prevCalculations = prevProps.calculations
        if (
            years?.data?.length > 0 &&
            cities?.data?.length > 0 &&
            calculations?.data?.length > 0 &&
            !prevCalculations?.data?.length &&
            !filteredCalculations?.length &&
            !isMultiParams
        ) {
            selectedYears = selectedYears ?? ['all']
            selectedCities = selectedCities ?? cities.data.slice(0, 6)
            this.setState({
                selectedYears,
                selectedCities,
                filteredCalculations: calculations.data?.filter(
                    (calculation) =>
                        ((!selectedYears.includes('all') &&
                            selectedYears.includes(calculation.year)) ||
                            selectedYears.includes('all')) &&
                        selectedCities.includes(calculation.city)
                ),
            })
        }
    }

    render() {
        const { years, cities, calculations, getCalculationsForChart } = this.props
        const {
            selectedYears,
            selectedCities,
            filteredCalculations,
            selectedParameter,
            parameterPostfix,
            isLineChart,
            isMultiParams,
            selectedMultiParameters,
            multiParametersCity,
        } = this.state
        return (
            <StyleRoot>
                <SettingsSwitch switchIsRegionEnabled={false} />
                <div style={Style.charts}>
                    <Space direction='vertical' style={Style.filters}>
                        <Space direction='horizontal'>
                            <SelectParameter
                                selectedParameter={
                                    isMultiParams ? selectedMultiParameters : selectedParameter
                                }
                                width={420}
                                onChangeSelectedParameter={(parameter) => {
                                    if (isMultiParams) {
                                        getCalculationsForChart(
                                            parameter,
                                            true,
                                            multiParametersCity
                                        )
                                        this.setState({
                                            selectedMultiParameters: parameter,
                                        })
                                    } else {
                                        getCalculationsForChart(parameter)
                                        this.setState({
                                            selectedParameter: parameter,
                                            filteredCalculations: [],
                                            parameterPostfix:
                                                PARAMETERS.find((p) => p.id === parameter)
                                                    ?.postfix ?? '',
                                        })
                                    }
                                }}
                                mode={isMultiParams ? 'multiple' : undefined}
                            />
                            <Space direction='vertical'>
                                {!isMultiParams ? (
                                    <Space direction='horizontal'>
                                        <Text style={Style.switchText}>Линейный график:</Text>
                                        <Switch
                                            checked={isLineChart}
                                            onChange={(value) =>
                                                this.setState({ isLineChart: value })
                                            }
                                        />
                                    </Space>
                                ) : undefined}
                                <Space direction='horizontal'>
                                    <Text style={Style.switchText}>Несколько параметров:</Text>
                                    <Switch
                                        loading={
                                            !!(
                                                years?.isLoading ||
                                                cities?.isLoading ||
                                                calculations?.isLoading
                                            )
                                        }
                                        checked={isMultiParams}
                                        onChange={(value) => {
                                            let newState = { isMultiParams: value }
                                            if (
                                                value &&
                                                !multiParametersCity &&
                                                cities?.data?.length > 0
                                            ) {
                                                newState = {
                                                    ...newState,
                                                    multiParametersCity: cities.data[0],
                                                }
                                            }
                                            if (value)
                                                getCalculationsForChart(
                                                    selectedMultiParameters,
                                                    true,
                                                    multiParametersCity || cities.data[0]
                                                )
                                            if (!value) getCalculationsForChart(selectedParameter)
                                            this.setState(newState)
                                        }}
                                    />
                                </Space>
                            </Space>
                        </Space>
                        <Space direction='horizontal'>
                            <Text style={Style.title}>Город{isMultiParams ? '' : 'а'}:</Text>
                            <Select
                                style={Style.select}
                                mode={isMultiParams ? undefined : 'multiple'}
                                placeholder='Город'
                                value={isMultiParams ? multiParametersCity : selectedCities}
                                onChange={(_cities) => {
                                    if (isMultiParams)
                                        this.setState({
                                            multiParametersCity: _cities,
                                        })
                                    else
                                        this.setState({
                                            selectedCities: _cities.sort(),
                                            filteredCalculations: calculations?.data?.filter(
                                                (calculation) =>
                                                    _cities?.includes(calculation.city) &&
                                                    ((!selectedYears.includes('all') &&
                                                        selectedYears.includes(calculation.year)) ||
                                                        selectedYears.includes('all'))
                                            ),
                                        })
                                }}
                                allowClear={!isMultiParams}
                                showSearch
                                filterOption={(input, option) =>
                                    option?.value
                                        ?.toString()
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase())
                                }
                            >
                                {cities?.data?.map((_c) => (
                                    <Select.Option key={_c} value={_c}>
                                        {_c}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Text style={Style.title}>Года:</Text>
                            <Select
                                style={Style.select}
                                mode='multiple'
                                placeholder='Год'
                                value={selectedYears}
                                onChange={(_years) => {
                                    if (_years.at(-1) === 'all') {
                                        this.setState({
                                            selectedYears: ['all'],
                                            filteredCalculations: calculations.data?.filter(
                                                (calculation) =>
                                                    years.data.includes(calculation.year) &&
                                                    selectedCities.includes(calculation.city)
                                            ),
                                        })
                                    } else {
                                        this.setState({
                                            selectedYears: _years
                                                .filter((_year) => _year !== 'all')
                                                .sort(),
                                            filteredCalculations: calculations.data?.filter(
                                                (calculation) =>
                                                    _years.includes(calculation.year) &&
                                                    selectedCities.includes(calculation.city)
                                            ),
                                        })
                                    }
                                }}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label
                                        ?.toString()
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase())
                                }
                            >
                                <Select.Option key='all' value='all' label='Все'>
                                    Все
                                </Select.Option>
                                {years?.data?.map((_y) => (
                                    <Select.Option key={_y} value={_y} label={_y}>
                                        {_y}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Space>
                    </Space>
                    {isMultiParams &&
                        calculations?.data?.filter(
                            (cityValues) => cityValues.city === multiParametersCity
                        )?.[0]?.values?.length > 0 && (
                            <Line
                                data={calculations.data
                                    .filter(
                                        (cityValues) => cityValues.city === multiParametersCity
                                    )[0]
                                    .values.filter(
                                        (calculation) =>
                                            selectedYears?.[0] === 'all' ||
                                            selectedYears?.includes(calculation.year)
                                    )}
                                xField='year'
                                yField='value'
                                seriesField='parameter'
                                meta={{
                                    value: {
                                        formatter: (value) => convertNumber(value),
                                    },
                                }}
                                lineStyle={{ lineWidth: 5 }}
                                smooth
                            />
                        )}
                    {!isMultiParams && filteredCalculations?.length > 0 && (
                        <div style={Style.columnsContainer}>
                            {isLineChart ? (
                                <Line
                                    data={filteredCalculations}
                                    xField='year'
                                    yField={selectedParameter.replace('_ci', '')}
                                    seriesField='city'
                                    meta={{
                                        [selectedParameter.replace('_ci', '')]: {
                                            formatter: (value) =>
                                                convertNumber(value, { postfix: parameterPostfix }),
                                        },
                                    }}
                                    lineStyle={{ lineWidth: 5 }}
                                    smooth
                                />
                            ) : (
                                <Column
                                    data={filteredCalculations}
                                    xField='city'
                                    yField={selectedParameter.replace('_ci', '')}
                                    seriesField='year'
                                    isGroup
                                    meta={{
                                        [selectedParameter.replace('_ci', '')]: {
                                            formatter: (value) =>
                                                convertNumber(value, { postfix: parameterPostfix }),
                                        },
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </StyleRoot>
        )
    }
}

Charts.propTypes = {
    calculations: PropTypes.object,
    years: PropTypes.object,
    cities: PropTypes.object,
    getCalculationsForChart: PropTypes.func.isRequired,
    getYears: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    settings: PropTypes.object,
}

Charts.defaultProps = {
    calculations: {},
    years: {},
    cities: {},
    settings: {},
}

export default connect(
    (state) => ({
        calculations: state.calculations[pagesState.CHARTS_PAGE].calculations,
        years: state.calculations[pagesState.CHARTS_PAGE].years,
        cities: state.calculations[pagesState.CHARTS_PAGE].cities,
        settings: state.settings,
    }),
    (dispatch) => ({
        getCalculationsForChart: (parameter, isMultiParams, city) =>
            dispatch(actions.getCalculationsForChart(parameter, isMultiParams, city)),
        getYears: () => dispatch(actions.getYears(pagesState.CHARTS_PAGE, false)),
        getCities: () => dispatch(actions.getCities(pagesState.CHARTS_PAGE)),
    })
)(Charts)
