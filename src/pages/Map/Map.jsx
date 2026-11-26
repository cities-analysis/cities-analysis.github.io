import React, { PureComponent } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, Select, Space, Typography } from 'antd'
import Style from './Style'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import CustomClusterGroup from './CustomClusterGroup/CustomClusterGroup'
import 'leaflet/dist/images/marker-shadow.png'
import * as actions from '../../redux/actions/calculations'
import { convertNumber } from '../../utils/CommonConverter'
import SettingsSwitch from '../../components/SettingsSwitch/SettingsSwitch'
import pagesState from '../pagesState'
import regionsBorders from '../../regionsBorders/allRegions.json'

const { Text } = Typography

export const URL = 'map'

class Map extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            groupingEnabled: true,
            year: undefined,
            filteredCalculations: [],
            previouslySelectedYear: undefined,
            selectedCitiesOrRegions: ['all'],
        }
    }

    componentDidMount() {
        const { getYears, getCities, getRegions } = this.props
        getYears(true)
        getYears(false)
        getCities()
        getRegions()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { cityYears, regionYears, getCalculationsOnMap, settings, calculations } = this.props
        const { year, previouslySelectedYear, selectedCitiesOrRegions } = this.state
        const prevCityYears = prevProps.cityYears
        const prevRegionYears = prevProps.regionYears
        if (
            !settings.isRegion &&
            prevCityYears.isLoading &&
            !cityYears.isLoading &&
            cityYears?.data?.length > 0
        ) {
            this.setState({
                year:
                    previouslySelectedYear && previouslySelectedYear in regionYears.data
                        ? previouslySelectedYear
                        : cityYears.data[0],
            })
            getCalculationsOnMap(cityYears.data[0])
        }
        if (
            settings.isRegion &&
            prevRegionYears.isLoading &&
            !regionYears.isLoading &&
            prevRegionYears?.data?.length > 0
        ) {
            this.setState({
                year:
                    previouslySelectedYear && previouslySelectedYear in regionYears.data
                        ? previouslySelectedYear
                        : regionYears.data[0],
            })
            getCalculationsOnMap(regionYears.data[0])
        }
        if (
            settings.isRegion !== prevProps.settings.isRegion ||
            settings.indexed !== prevProps.settings.indexed
        ) {
            getCalculationsOnMap(year)
            this.setState({
                filteredCalculations: [],
                previouslySelectedYear: year,
                selectedCitiesOrRegions:
                    settings.isRegion === prevProps.settings.isRegion
                        ? selectedCitiesOrRegions
                        : ['all'],
            })
        }
        if (
            selectedCitiesOrRegions.at(-1) !== 'all' &&
            prevProps.calculations?.isLoading &&
            !calculations?.isLoading &&
            calculations?.data?.length > 0
        ) {
            this.setState({
                filteredCalculations: calculations?.data?.filter((calculation) =>
                    selectedCitiesOrRegions.includes(
                        settings.isRegion ? calculation.region : calculation.city
                    )
                ),
            })
        }
        if (selectedCitiesOrRegions?.length === 0) {
            this.setState({ selectedCitiesOrRegions: ['all'] })
        }
    }

    renderMarkers() {
        const { calculations, settings } = this.props
        const { groupingEnabled, year, selectedCitiesOrRegions, filteredCalculations } = this.state
        const data =
            selectedCitiesOrRegions?.length > 0 && selectedCitiesOrRegions?.[0] !== 'all'
                ? filteredCalculations
                : calculations.data
        if ((settings.isRegion && data?.[0]?.city) || (!settings.isRegion && data?.[0]?.region))
            return undefined
        const markers = data?.map((calculation) => (
            <Marker
                key={calculation.region || calculation.city}
                position={[calculation.latitude, calculation.longitude]}
            >
                <Popup position={[calculation.latitude, calculation.longitude]} maxWidth={400}>
                    {settings.isRegion ? (
                        <>
                            <center>
                                <h3>
                                    <b>{`${calculation.region} - ${year} г.`}</b>
                                </h3>
                            </center>
                            <table style={Style.table}>
                                <tbody>
                                    <tr>
                                        <td>Среднесписочная численность (ССЧ):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ssch, { postfix: 'чел.' })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Производительность труда:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.labor_productivity, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Трудовооруженность:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.capital_labor_ratio, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Средняя оплата труда:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.avg_labor_cost, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла (Выручка):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_revenues, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-between (Выручка):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_b_revenues, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-within (Выручка):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_w_revenues, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла (Основные средства):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_fixed_assets, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-between (Основные средства):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_b_fixed_assets, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-within (Основные средства):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_w_fixed_assets, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла (Оплата труда):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_wages, { precision: 4 })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-between (Оплата труда):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_b_wages, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла-within (Оплата труда):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_w_wages, {
                                                precision: 4,
                                            })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <>
                            <center>
                                <h3>
                                    <b>{`${calculation.city} - ${year} г.`}</b>
                                </h3>
                            </center>
                            <table style={Style.table}>
                                <tbody>
                                    <tr>
                                        <td>Население:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.population, {
                                                postfix: 'чел.',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Отгружено товаров:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.export, { postfix: '₽' })}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Инвестиции:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.investments, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Миграция:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.migration, {
                                                postfix: 'чел.',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Выручка:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.revenues, { postfix: '₽' })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Основные средства:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.fixed_assets, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Оплата труда:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.wages, { postfix: '₽' })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Среднесписочная численность (ССЧ):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ssch, { postfix: 'чел.' })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Производительность труда:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.labor_productivity, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Трудовооруженность:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.capital_labor_ratio, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Средняя оплата труда:</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.avg_labor_cost, {
                                                postfix: '₽',
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HHI (Выручка):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.hhi_revenues)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HHI (Основные средства):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.hhi_fixed_assets)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HHI (Оплата труда):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.hhi_wages)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Индекс Тейла (Выручка):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_revenues)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Индекс Тейла (Основные средства):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_fixed_assets)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Индекс Тейла (Оплата труда):</td>
                                        <td style={Style.tableData}>
                                            {convertNumber(calculation.ti_wages)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </Popup>
            </Marker>
        ))
        if (groupingEnabled)
            return <CustomClusterGroup showCoverageOnHover>{markers}</CustomClusterGroup>
        return markers
    }

    render() {
        const {
            cityYears,
            regionYears,
            getCalculationsOnMap,
            calculations,
            settings,
            cities,
            regions,
        } = this.props
        const { year, groupingEnabled, selectedCitiesOrRegions } = this.state
        return (
            <div>
                <SettingsSwitch />
                <div style={Style.map}>
                    <Space direction='vertical' style={Style.filters}>
                        <Space direction='horizontal'>
                            <Text>{settings.isRegion ? 'Регионы' : 'Города:'}</Text>
                            <Select
                                style={Style.select}
                                mode='multiple'
                                placeholder={settings.isRegion ? 'Регион' : 'Город'}
                                value={selectedCitiesOrRegions ?? []}
                                onChange={(citiesOrRegions) => {
                                    if (citiesOrRegions.at(-1) === 'all') {
                                        this.setState({
                                            selectedCitiesOrRegions: ['all'],
                                            filteredCalculations: calculations?.data,
                                        })
                                    } else {
                                        this.setState({
                                            selectedCitiesOrRegions: citiesOrRegions
                                                .filter((_city) => _city !== 'all')
                                                .sort(),
                                            filteredCalculations: calculations?.data?.filter(
                                                (calculation) =>
                                                    citiesOrRegions.includes(
                                                        settings.isRegion
                                                            ? calculation.region
                                                            : calculation.city
                                                    )
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
                                {settings.isRegion
                                    ? regions?.data?.map((_r) => (
                                          <Select.Option key={_r} value={_r} label={_r}>
                                              {_r}
                                          </Select.Option>
                                      ))
                                    : cities?.data?.map((_c) => (
                                          <Select.Option key={_c} value={_c} label={_c}>
                                              {_c}
                                          </Select.Option>
                                      ))}
                            </Select>
                        </Space>
                        <Space direction='horizontal'>
                            <Text style={Style.title}>Год:</Text>
                            <Select
                                style={Style.selectYear}
                                value={year}
                                showSearch
                                placeholder='Год'
                                onChange={(_y) => {
                                    this.setState({ year: _y })
                                    if (_y !== year) getCalculationsOnMap(_y)
                                }}
                                filterOption={(input, option) =>
                                    option?.value
                                        ?.toString()
                                        ?.toLowerCase()
                                        ?.includes(input?.toLowerCase())
                                }
                            >
                                {(settings.isRegion ? regionYears.data : cityYears.data)?.map(
                                    (_y) => (
                                        <Select.Option key={_y} value={_y}>
                                            {_y}
                                        </Select.Option>
                                    )
                                )}
                            </Select>
                        </Space>
                        <Checkbox
                            checked={groupingEnabled}
                            onChange={(e) => this.setState({ groupingEnabled: e.target.checked })}
                        >
                            Группировка маркеров
                        </Checkbox>
                    </Space>
                    <MapContainer
                        center={[60, 70]}
                        zoom={4}
                        style={Style.innerMap}
                        maxZoom={12}
                        minZoom={4}
                        fullscreenControl
                        worldCopyJump
                    >
                        <TileLayer
                            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {settings.isRegion && (
                            <GeoJSON
                                data={regionsBorders}
                                style={{
                                    color: '#d4380d',
                                    weight: 2,
                                    opacity: 0.9,
                                    fillColor: '#fa8c16',
                                    fillOpacity: 0.08,
                                }}
                            />
                        )}
                        {this.renderMarkers()}
                    </MapContainer>
                </div>
            </div>
        )
    }
}

Map.propTypes = {
    calculations: PropTypes.object,
    cityYears: PropTypes.object,
    regionYears: PropTypes.object,
    getCalculationsOnMap: PropTypes.func.isRequired,
    getYears: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    getRegions: PropTypes.func.isRequired,
    cities: PropTypes.object,
    regions: PropTypes.object,
    settings: PropTypes.object,
}

Map.defaultProps = {
    calculations: {},
    cityYears: {},
    regionYears: {},
    cities: {},
    regions: {},
    settings: {},
}

export default connect(
    (state) => ({
        calculations: state.calculations[pagesState.MAP_PAGE]?.calculations,
        cityYears: state.calculations[pagesState.MAP_PAGE]?.cityYears,
        regionYears: state.calculations[pagesState.MAP_PAGE]?.regionYears,
        cities: state.calculations[pagesState.MAP_PAGE]?.cities,
        regions: state.calculations[pagesState.MAP_PAGE]?.regions,
        settings: state.settings,
    }),
    (dispatch) => ({
        getCalculationsOnMap: (year) =>
            dispatch(actions.getCalculationsOnMap(year, pagesState.MAP_PAGE, false)),
        getYears: (isRegion) => dispatch(actions.getYears(pagesState.MAP_PAGE, isRegion)),
        getCities: () => dispatch(actions.getCities(pagesState.MAP_PAGE)),
        getRegions: () => dispatch(actions.getRegions(pagesState.MAP_PAGE)),
    })
)(Map)
