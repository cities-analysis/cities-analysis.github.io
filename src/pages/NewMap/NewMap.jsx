import React, { PureComponent } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, Select, Space, Typography } from 'antd'
import chroma from 'chroma-js'
import Style from './Style'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/images/marker-shadow.png'
import * as actions from '../../redux/actions/calculations'
import { PARAMETERS } from '../../constants'
import SelectParameter from '../../components/SelectParameter/SelectParameter'
import { convertNumber } from '../../utils/CommonConverter'
import { selectBorder } from '../../citiesBorders/selectBorder'
import SettingsSwitch from '../../components/SettingsSwitch/SettingsSwitch'
import pagesState from '../pagesState'
import region1 from '../../regionsBorders/АлтайскийКрай.json'
import region2 from '../../regionsBorders/КемеровскаяОбласть.json'
import region3 from '../../regionsBorders/СвердловскаяОбласть.json'
import region4 from '../../regionsBorders/ТомскаяОбласть.json'
import region5 from '../../regionsBorders/ХантыМансийскийАвтономныйОкруг.json'
import region6 from '../../regionsBorders/ЧелябинскаяОбласть.json'
import region7 from '../../regionsBorders/РеспубликаХакасия.json'

const { Text } = Typography

const gradientColors = ['#0007fd', '#00fbfd', '#00fd06', '#fdf800', '#fd0800']

const getColor = chroma.scale(gradientColors)

export const URL = 'new_map'

// TODO Перенести на сервер
// const getBorderColor = (city, defaultColor) => {
//     switch (city) {
//         case 'Екатеринбург':
//         case 'Челябинск':
//         case 'Кемерово':
//         case 'Барнаул':
//         case 'Томск':
//         case 'Ханты-Мансийск':
//             return 'rgba(255,0,0,0.8)'
//         case 'Нижний Тагил':
//         case 'Магинтогорск':
//         case 'Миасс':
//         case 'Новокузнецк':
//         case 'Бийск':
//         case 'Сургут':
//         case 'Когалым':
//         case 'Нижневартовск':
//             return 'rgba(0,60,255,0.8)'
//         case 'Каменск-Уральский':
//         case 'Златоуст':
//         case 'Копейск':
//         case 'Прокопьевск':
//         case 'Рубцовск':
//         case 'Северск':
//         case 'Нефтеюганск':
//             return 'rgba(61,108,255,0.8)'
//         case 'Сысерт':
//         case 'Первоуральск':
//         case 'Верхняя Пышма':
//         case 'Озерск':
//         case 'Булово':
//         case 'Магион':
//         case 'Урай':
//         case 'Нягань':
//             return 'rgba(162,181,255,0.8)'
//         default:
//             return defaultColor
//     }
// }

class NewMap extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            year: props.years.cityYears?.[0],
            colors: getColor.colors(gradientColors.length),
            selectedParameter: PARAMETERS[0].id,
            parameterPostfix: PARAMETERS[0].postfix,
            min: undefined,
            max: undefined,
            selectedCities: ['all'],
            filteredCalculations: [],
            showRegionBorders: true,
        }
    }

    componentDidMount() {
        const { getYears, getCities } = this.props
        getYears()
        getCities()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { years, getCalculationsOnMap, calculations, settings } = this.props
        const { min, max, year, selectedCities } = this.state
        const prevYears = prevProps.years
        if (prevYears.isLoading && !years.isLoading && years.data?.length > 0) {
            const latestYear = Math.max(...years.data)
            this.setState({ year: latestYear })
            getCalculationsOnMap(latestYear)
        }
        if (calculations?.data?.length > 0 && min === undefined && max === undefined) {
            const minMax = this.getMinMaxValue()
            if (minMax.length > 0) {
                this.setState({
                    min: minMax[0],
                    max: minMax[1],
                })
            }
        }
        if (
            prevProps.calculations?.isLoading &&
            !calculations?.isLoading &&
            selectedCities.at(-1) !== 'all' &&
            calculations?.data?.length > 0
        ) {
            this.setState({
                filteredCalculations: calculations?.data?.filter((calculation) =>
                    selectedCities.includes(calculation.city)
                ),
            })
        }
        if (selectedCities?.length === 0) {
            this.setState({ selectedCities: ['all'] })
        }
        if (settings.indexed !== prevProps.settings.indexed) {
            getCalculationsOnMap(year)
            this.setState({ min: undefined, max: undefined })
        }
    }

    getMinMaxValue() {
        const { calculations } = this.props
        const { selectedParameter } = this.state
        if (calculations?.data?.length > 0) {
            let min
            let max
            calculations.data.forEach((calculation) => {
                const value = calculation[selectedParameter]
                if (value === null || value === undefined) return
                if (max === undefined || value > max) max = value
                if (min === undefined || value < min) min = value
            })
            if (min === undefined) return [0, 0]
            return [min, max]
        }
        return []
    }

    renderGeoJSONCities() {
        const { calculations } = this.props
        const { selectedParameter, max, parameterPostfix, selectedCities, filteredCalculations } =
            this.state
        const calculationsForDisplay =
            selectedCities?.length > 0 && selectedCities?.[0] !== 'all'
                ? filteredCalculations
                : calculations?.data

        return calculationsForDisplay?.map((calculation) => {
            const city = selectBorder(calculation.city)
            if (city) {
                const value = calculation[selectedParameter]
                const fillColor =
                    max > 0 && value !== null && value !== undefined
                        ? getColor(value / max)
                        : 'rgba(0,0,0,0.46)'
                // const color = max > 0 ? getBorderColor(calculation.city, fillColor) : fillColor
                return (
                    <GeoJSON
                        key={`${city.id}${selectedParameter}${Math.round(Math.random() * 1000)}`}
                        data={city}
                        style={{
                            color: '#000000',
                            fillColor,
                            fillOpacity: 0.6,
                            opacity: 0.8,
                        }}
                        onEachFeature={(feature, layer) =>
                            layer.on('mouseover', () =>
                                layer
                                    .bindTooltip(
                                        `${calculation.city}: ${convertNumber(
                                            calculation[selectedParameter],
                                            { postfix: parameterPostfix }
                                        )}`
                                    )
                                    .openTooltip()
                            )
                        }
                    />
                )
            }
            return undefined
        })
    }

    renderGeoJSONRegions() {
        const { selectedParameter } = this.state
        return [region1, region2, region3, region4, region5, region6, region7].map((region) => (
            <GeoJSON
                key={`region${region.id}${selectedParameter}`}
                data={region}
                style={{
                    color: '#000000',
                    fillColor: '#FFFFFF',
                    fillOpacity: 0,
                    opacity: 0.8,
                }}
            />
        ))
    }

    render() {
        const { years, getCalculationsOnMap, cities, calculations } = this.props
        const {
            year,
            colors,
            selectedParameter,
            min,
            max,
            parameterPostfix,
            selectedCities,
            showRegionBorders,
        } = this.state
        if (!cities?.data?.length) return undefined
        return (
            <div>
                <SettingsSwitch switchIsRegionEnabled={false} />
                <div style={Style.map}>
                    <Space direction='vertical' style={Style.filters}>
                        <SelectParameter
                            selectedParameter={selectedParameter}
                            width={420}
                            onChangeSelectedParameter={(parameter) =>
                                this.setState({
                                    selectedParameter: parameter,
                                    parameterPostfix:
                                        PARAMETERS.find((p) => p.id === parameter)?.postfix ?? '',
                                    min: undefined,
                                    max: undefined,
                                })
                            }
                        />
                        <Space direction='horizontal'>
                            <Text style={Style.text}>Города:</Text>
                            <Select
                                style={Style.select}
                                mode='multiple'
                                placeholder='Город'
                                value={selectedCities ?? []}
                                onChange={(_cities) => {
                                    if (_cities.at(-1) === 'all') {
                                        this.setState({
                                            selectedCities: ['all'],
                                            filteredCalculations: calculations?.data,
                                        })
                                    } else {
                                        this.setState({
                                            selectedCities: _cities
                                                .filter((_city) => _city !== 'all')
                                                .sort(),
                                            filteredCalculations: calculations?.data?.filter(
                                                (calculation) => _cities.includes(calculation.city)
                                            ),
                                        })
                                    }
                                }}
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label
                                        ?.toString()
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase())
                                }
                                allowClear
                            >
                                <Select.Option key='all' value='all' label='Все'>
                                    Все
                                </Select.Option>
                                {cities?.data?.map((_c) => (
                                    <Select.Option key={_c} value={_c} label={_c}>
                                        {_c}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Space>
                        <Space direction='horizontal'>
                            <Text style={Style.text}>Год:</Text>
                            <Select
                                style={Style.selectYear}
                                value={year}
                                showSearch
                                placeholder='Год'
                                onChange={(_y) => {
                                    this.setState({ year: _y, min: undefined, max: undefined })
                                    if (_y !== year) getCalculationsOnMap(_y)
                                }}
                                filterOption={(input, option) =>
                                    option?.value
                                        ?.toString()
                                        ?.toLowerCase()
                                        ?.includes(input?.toLowerCase())
                                }
                            >
                                {years.data?.map((_y) => (
                                    <Select.Option key={_y} value={_y}>
                                        {_y}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Checkbox
                                checked={showRegionBorders}
                                onChange={(e) =>
                                    this.setState({ showRegionBorders: e.target.checked })
                                }
                            >
                                Границы областей
                            </Checkbox>
                        </Space>
                    </Space>
                    <div style={Style.gradientContainer}>
                        <Space direction='horizontal' style={Style.gradientLabelContainer}>
                            <div style={Style.gradientLabelMin}>
                                {convertNumber(min ?? 0, { postfix: parameterPostfix })}
                                <div style={Style.gradientLabelMinContainer}>
                                    <div style={Style.gradientLabelLine} />
                                </div>
                            </div>
                            {max || min
                                ? [0.2, 0.4, 0.6, 0.8].map((p) => (
                                      <div key={p.toString()} style={Style.gradientLabelCenter}>
                                          {convertNumber((max - min) * p, {
                                              postfix: parameterPostfix,
                                          })}
                                          <div style={Style.gradientLabelCenterContainer}>
                                              <div style={Style.gradientLabelLine} />
                                          </div>
                                      </div>
                                  ))
                                : undefined}
                            <div style={Style.gradientLabelMax}>
                                {convertNumber(max ?? 0, { postfix: parameterPostfix })}
                                <div style={Style.gradientLabelMaxContainer}>
                                    <div style={Style.gradientLabelLine} />
                                </div>
                            </div>
                        </Space>
                        <div
                            style={{
                                ...Style.gradient,
                                backgroundImage: `linear-gradient(to right, ${colors.join()})`,
                            }}
                        />
                    </div>
                    <MapContainer
                        center={[60, 70]}
                        zoom={6}
                        style={Style.innerMap}
                        maxZoom={12}
                        minZoom={3}
                        fullscreenControl
                        worldCopyJump
                    >
                        <TileLayer
                            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                            attribution='&copy;
                        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
                        | Границы городов определены в соответствии с
                        <a href="https://mydata.biz/ru/catalog/databases/borders_ru">муниципальным делением РФ</a>'
                        />
                        {showRegionBorders ? this.renderGeoJSONRegions() : undefined}
                        {calculations?.data?.length > 0 ? this.renderGeoJSONCities() : undefined}
                    </MapContainer>
                </div>
            </div>
        )
    }
}

NewMap.propTypes = {
    calculations: PropTypes.object,
    years: PropTypes.object,
    cities: PropTypes.object,
    getCalculationsOnMap: PropTypes.func.isRequired,
    getYears: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    settings: PropTypes.object,
}

NewMap.defaultProps = {
    calculations: {},
    years: {},
    cities: {},
    settings: {},
}

export default connect(
    (state) => ({
        calculations: state.calculations[pagesState.NEW_MAP_PAGE]?.calculations,
        years: state.calculations[pagesState.NEW_MAP_PAGE]?.years,
        cities: state.calculations[pagesState.NEW_MAP_PAGE]?.cities,
        settings: state.settings,
    }),
    (dispatch) => ({
        getCalculationsOnMap: (year) =>
            dispatch(actions.getCalculationsOnMap(year, pagesState.NEW_MAP_PAGE, true)),
        getYears: () => dispatch(actions.getYears(pagesState.NEW_MAP_PAGE)),
        getCities: () => dispatch(actions.getCities(pagesState.NEW_MAP_PAGE)),
    })
)(NewMap)
