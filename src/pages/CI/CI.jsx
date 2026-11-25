import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Typography, Space, Skeleton, Select, Divider, Tooltip } from 'antd'
import { Pie } from '@ant-design/plots'
import Style from './Style'
import * as actions from '../../redux/actions/calculations'
import { convertNumber } from '../../utils/CommonConverter'
import SettingsSwitch from '../../components/SettingsSwitch/SettingsSwitch'
import pagesState from '../pagesState'

const { Text } = Typography

export const URL = 'ci'

class CI extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentCityIndex: undefined,
            currentYear: undefined,
            selectedCategory: undefined,
            previouslySelectedYear: undefined,
        }
    }

    componentDidMount() {
        const { getCities, getCICategories } = this.props
        getCICategories()
        getCities()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { cities, getCIInfo, ciInfo, settings } = this.props
        const { currentCityIndex, previouslySelectedYear } = this.state
        if (settings.indexed !== prevProps.settings.indexed) {
            const { currentYear } = this.state
            this.setState({ previouslySelectedYear: currentYear })
            getCIInfo(cities.data[currentCityIndex])
        }
        if (cities?.data?.length > 0 && !cities?.isLoading && prevProps?.cities?.isLoading) {
            this.setState({ currentCityIndex: 0 })
            getCIInfo(cities.data[0])
        }
        const CIData = ciInfo?.data
        const currentYear = Object.keys(CIData ?? {})?.[0]
        if (currentYear && !ciInfo?.isLoading && prevProps.ciInfo?.isLoading) {
            this.setState({
                currentYear:
                    previouslySelectedYear && previouslySelectedYear in CIData
                        ? previouslySelectedYear
                        : currentYear,
            })
        }
    }

    onCityChanged(index) {
        const { cities, getCIInfo } = this.props
        const { currentYear } = this.state
        this.setState({
            currentCityIndex: index,
            currentYear: undefined,
            previouslySelectedYear: currentYear,
        })
        getCIInfo(cities?.data?.[index])
    }

    renderPieOrgsAndIp(categoryId, parameter) {
        const { ciInfo } = this.props
        const { currentYear } = this.state
        const info = ciInfo?.data?.[currentYear]
        if (info) {
            const categoryOrgsValue = info?.[categoryId]?.orgs?.[parameter] ?? 0
            const categoryIpValue = info?.[categoryId]?.ip?.[parameter] ?? 0
            const totalValue = info?.ci?.[parameter] ?? 0
            const content = totalValue > 0 ? convertNumber(totalValue) : '0'
            if (totalValue === 0)
                return (
                    <Text style={Style.pieNoData}>
                        <br />
                        <br />
                        <br />
                        <br />
                        Отсутсвуют данные
                        <br />
                        <br />
                        <br />
                        <br />
                    </Text>
                )
            return (
                <Pie
                    data={[
                        {
                            type: 'Организации',
                            value: categoryOrgsValue,
                        },
                        {
                            type: 'ИП',
                            value: categoryIpValue,
                        },
                        {
                            type: 'Прочие КИ',
                            value: totalValue - categoryOrgsValue - categoryIpValue,
                        },
                    ]}
                    appendPadding={10}
                    angleField='value'
                    colorField='type'
                    style={Style.pie}
                    radius={1}
                    innerRadius={0.6}
                    label={{
                        type: 'outer',
                        content: '{percentage}',
                        style: {
                            textAlign: 'center',
                            fontSize: 10,
                        },
                    }}
                    legend={{
                        layout: 'horizontal',
                        position: 'top',
                        maxRow: 2,
                        flipPage: false,
                    }}
                    color={['#b3f1ff', '#ff6b6b', '#d8d8d9']}
                    interactions={[{ type: 'element-active' }]}
                    tooltip={{
                        formatter: (item) => ({
                            name: item.type,
                            value: convertNumber(item.value),
                        }),
                    }}
                    statistic={{
                        title: {
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                            },
                            content,
                        },
                        content:
                            content !== '0'
                                ? {
                                      style: {
                                          fontSize: 14,
                                          fontWeight: 'none',
                                      },
                                      content: 'ед.',
                                  }
                                : false,
                    }}
                />
            )
        }
        return undefined
    }

    renderPieOrgs(categoryId, parameter) {
        const { ciInfo } = this.props
        const { currentYear } = this.state
        const info = ciInfo?.data?.[currentYear]
        if (info) {
            const categoryOrgsValue = info?.[categoryId]?.orgs?.[parameter] ?? 0
            const totalValue = info?.ci?.[parameter] ?? 0
            const content =
                totalValue > 0
                    ? convertNumber(totalValue, {
                          postfix: '₽',
                          useShortVersion: true,
                      })
                    : '0'
            if (totalValue === 0)
                return (
                    <Text style={Style.pieNoData}>
                        <br />
                        <br />
                        <br />
                        <br />
                        Отсутсвуют данные
                        <br />
                        <br />
                        <br />
                        <br />
                    </Text>
                )
            return (
                <Pie
                    data={[
                        {
                            type: 'Организации',
                            value: categoryOrgsValue,
                        },
                        {
                            type: 'Прочие КИ',
                            value: totalValue - categoryOrgsValue,
                        },
                    ]}
                    appendPadding={20}
                    angleField='value'
                    colorField='type'
                    style={Style.pie}
                    radius={1}
                    innerRadius={0.6}
                    label={{
                        type: 'outer',
                        content: '{percentage}',
                        style: {
                            textAlign: 'center',
                            fontSize: 10,
                        },
                    }}
                    legend={{
                        layout: 'horizontal',
                        position: 'top',
                        maxRow: 2,
                        flipPage: false,
                    }}
                    color={['#e3ad01', '#d8d8d9']}
                    interactions={[{ type: 'element-active' }]}
                    tooltip={{
                        formatter: (item) => ({
                            name: item.type,
                            value: convertNumber(item.value, { postfix: '₽' }),
                        }),
                    }}
                    statistic={{
                        title: {
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                            },
                            content: content.split(' ')[0],
                        },
                        content:
                            content !== '0'
                                ? {
                                      style: {
                                          fontSize: 14,
                                          fontWeight: 'none',
                                      },
                                      content: content
                                          .split(' ')
                                          .slice(1, content.split(' ').length)
                                          .join(' '),
                                  }
                                : false,
                    }}
                />
            )
        }
        return undefined
    }

    render() {
        const { ciInfo, cities, categories } = this.props
        const { currentCityIndex, currentYear, selectedCategory } = this.state
        const currentInfo = ciInfo?.data?.[currentYear]?.common
        const currentCIInfo = ciInfo?.data?.[currentYear]?.ci
        const years = Object.keys(ciInfo?.data ?? {})
        return (
            <div>
                <SettingsSwitch switchIsRegionEnabled={false} />
                <div style={Style.ci}>
                    <Space direction='vertical' style={Style.container}>
                        <h1>Показатели креативных индустрий</h1>
                        <Space direction='vertical' style={Style.header}>
                            <Space direction='horizontal'>
                                <Select
                                    style={Style.selectCity}
                                    value={cities?.data?.[currentCityIndex]}
                                    showSearch
                                    bordered={false}
                                    showArrow={false}
                                    onChange={(_c) => {
                                        const indexOfCity = cities.data.indexOf(_c)
                                        if (currentCityIndex !== indexOfCity)
                                            this.onCityChanged(indexOfCity)
                                    }}
                                    filterOption={(input, option) =>
                                        option?.value
                                            ?.toString()
                                            ?.toLowerCase()
                                            ?.includes(input.toLowerCase())
                                    }
                                >
                                    {cities?.data?.map((_c) => (
                                        <Select.Option key={_c} value={_c}>
                                            <Text style={Style.option}>{_c}</Text>
                                        </Select.Option>
                                    ))}
                                </Select>
                                {currentYear ? (
                                    <Select
                                        style={Style.selectYear}
                                        value={currentYear}
                                        showArrow={false}
                                        bordered={false}
                                        onChange={(_y) => {
                                            if (currentYear !== _y) {
                                                this.setState({
                                                    currentYear: _y,
                                                })
                                            }
                                        }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.value
                                                ?.toString()
                                                ?.toLowerCase()
                                                ?.includes(input.toLowerCase())
                                        }
                                    >
                                        {years?.map((_y) => (
                                            <Select.Option key={_y} value={_y}>
                                                <Text style={Style.option}>{_y}</Text>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Skeleton.Input active size='small' />
                                )}
                            </Space>
                            <Divider style={{ ...Style.divider, ...Style.headerDivider }} />
                            <Space direction='horizontal'>
                                <div style={Style.commonInfo}>
                                    <Space direction='vertical'>
                                        <Space direction='horizontal'>
                                            <Text style={Style.text}>Действующие:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Действующие предприятия в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.existing ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Все действующие предприятия'>
                                                        {convertNumber(currentInfo?.existing ?? 0)}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>Зарегистрированные:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Зарегистрированные предприятия в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.registered ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Все зарегистрированные предприятия'>
                                                        {convertNumber(
                                                            currentInfo?.registered ?? 0
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>Ликвидированые:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Ликвидированые предприятия в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.liquidated ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Все ликвидированые предприятия'>
                                                        {convertNumber(
                                                            currentInfo?.liquidated ?? 0
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                        </Space>
                                        <Space
                                            direction='horizontal'
                                            style={{
                                                paddingTop: '20px',
                                                paddingBottom: '20px',
                                            }}
                                        >
                                            <Text style={Style.text}>Выручка:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Выручка предприятий в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.revenues ?? 0,
                                                            {
                                                                postfix: '₽',
                                                                useShortVersion: true,
                                                            }
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Выручка всех предприятий'>
                                                        {convertNumber(currentInfo?.revenues ?? 0, {
                                                            postfix: '₽',
                                                            useShortVersion: true,
                                                        })}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>Основные средства:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Основные средства предприятий в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.fixed_assets ?? 0,
                                                            {
                                                                postfix: '₽',
                                                                useShortVersion: true,
                                                            }
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Основные средства всех предприятий'>
                                                        {convertNumber(
                                                            currentInfo?.fixed_assets ?? 0,
                                                            {
                                                                postfix: '₽',
                                                                useShortVersion: true,
                                                            }
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>Зарплата:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='Оплата труда предприятий в области КИ'>
                                                        {convertNumber(currentCIInfo?.wages ?? 0, {
                                                            postfix: '₽',
                                                            useShortVersion: true,
                                                        })}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='Оплата труда всех предприятий'>
                                                        {convertNumber(currentInfo?.wages ?? 0, {
                                                            postfix: '₽',
                                                            useShortVersion: true,
                                                        })}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                        </Space>
                                        <Space direction='horizontal'>
                                            <Text style={Style.text}>HHI по выручке:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='HHI по выручке предприятий в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.hhi_revenues ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='HHI по выручке всех предприятий'>
                                                        {convertNumber(
                                                            currentInfo?.hhi_revenues ?? 0
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>
                                                HHI по основным средствам:
                                            </Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='HHI по основным средствам предприятий в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.hhi_fixed_assets ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='HHI по основным средствам всех предприятий'>
                                                        {convertNumber(
                                                            currentInfo?.hhi_fixed_assets ?? 0
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                            <Text style={Style.text}>HHI по зарплатам:</Text>
                                            {currentInfo ? (
                                                <div>
                                                    <Tooltip title='HHI по оплате труда предприятий в области КИ'>
                                                        {convertNumber(
                                                            currentCIInfo?.hhi_wages ?? 0
                                                        )}
                                                    </Tooltip>
                                                    {' / '}
                                                    <Tooltip title='HHI по оплате труда всех предприятий'>
                                                        {convertNumber(currentInfo?.hhi_wages ?? 0)}
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <Skeleton.Button active size='small' />
                                            )}
                                        </Space>
                                    </Space>
                                </div>
                            </Space>
                        </Space>
                        {currentCIInfo?.most_profitable?.length > 0 ? (
                            <Space direction='vertical'>
                                <h2>Крупнейшие предприятия в КИ</h2>
                                <Space direction='vertical' style={Style.orgsContainer}>
                                    {currentCIInfo?.most_profitable?.map((org, index) => (
                                        <Text key={org.org} style={Style.orgName}>
                                            {`${index < 9 ? ` ${index + 1}` : index + 1}) ${
                                                org.org
                                            } (Выручка ${convertNumber(org.revenues, {
                                                postfix: '₽',
                                                useShortVersion: true,
                                            })})`}
                                        </Text>
                                    ))}
                                </Space>
                            </Space>
                        ) : undefined}
                        {currentCIInfo ? (
                            <Divider style={Style.divider}>
                                <Space direction='horizontal'>
                                    <h3>Категории креативных индустрий</h3>
                                    <Select
                                        style={Style.selectCategory}
                                        value={selectedCategory?.title ?? 'Все'}
                                        onChange={(_c) => {
                                            if (selectedCategory !== _c) {
                                                this.setState({
                                                    selectedCategory:
                                                        _c === 'Все'
                                                            ? undefined
                                                            : categories.data.find(
                                                                  (c) => c.title === _c
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
                                    >
                                        <Select.Option key='all' value='all' label='Все'>
                                            Все
                                        </Select.Option>
                                        {categories?.data?.map((_c) => (
                                            <Select.Option
                                                key={_c.id}
                                                value={_c.title}
                                                label={_c.title}
                                            >
                                                {_c.title}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            </Divider>
                        ) : undefined}
                        {currentCIInfo
                            ? (selectedCategory?.id ? [selectedCategory] : categories?.data)?.map(
                                  (category) => (
                                      <Space
                                          key={category.id}
                                          direction='vertical'
                                          style={Style.category}
                                      >
                                          <Text style={Style.categoryTitle} strong>
                                              {category.title}
                                          </Text>
                                          <Space direction='horizontal' style={Style.categoryInfo}>
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Действующие
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организации и ИП
                                                  </Text>
                                                  {this.renderPieOrgsAndIp(category.id, 'existing')}
                                              </div>
                                              <Divider
                                                  style={{
                                                      ...Style.divider,
                                                      ...Style.verticalDivider,
                                                  }}
                                                  type='vertical'
                                              />
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Зарегистрированные
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организации и ИП
                                                  </Text>
                                                  {this.renderPieOrgsAndIp(
                                                      category.id,
                                                      'registered'
                                                  )}
                                              </div>
                                              <Divider
                                                  style={{
                                                      ...Style.divider,
                                                      ...Style.verticalDivider,
                                                  }}
                                                  type='vertical'
                                              />
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Ликвидированные
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организации и ИП
                                                  </Text>
                                                  {this.renderPieOrgsAndIp(
                                                      category.id,
                                                      'liquidated'
                                                  )}
                                              </div>
                                          </Space>
                                          <Divider style={{ ...Style.divider }} type='horizontal' />
                                          <Space direction='horizontal' style={Style.categoryInfo}>
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Выручка
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организаций
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      в области КИ
                                                  </Text>
                                                  {this.renderPieOrgs(category.id, 'revenues')}
                                              </div>
                                              <Divider
                                                  style={{
                                                      ...Style.divider,
                                                      ...Style.verticalDivider,
                                                  }}
                                                  type='vertical'
                                              />
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Основные средства
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организаций
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      в области КИ
                                                  </Text>
                                                  {this.renderPieOrgs(category.id, 'fixed_assets')}
                                              </div>
                                              <Divider
                                                  style={{
                                                      ...Style.divider,
                                                      ...Style.verticalDivider,
                                                  }}
                                                  type='vertical'
                                              />
                                              <div style={Style.pieContainer}>
                                                  <Text style={Style.pieTitle} strong>
                                                      Зарплата
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      Организаций
                                                  </Text>
                                                  <br />
                                                  <Text style={Style.pieTitle} strong>
                                                      в области КИ
                                                  </Text>
                                                  {this.renderPieOrgs(category.id, 'wages')}
                                              </div>
                                          </Space>
                                          {ciInfo?.data?.[currentYear]?.[category.id]?.orgs
                                              ?.most_profitable?.length > 0 ? (
                                              <Space direction='vertical'>
                                                  <Divider
                                                      style={{ ...Style.divider }}
                                                      type='horizontal'
                                                  />
                                                  <Text style={Style.pieTitle} strong>
                                                      Крупнейшие предприятия
                                                  </Text>
                                                  <Space
                                                      direction='vertical'
                                                      style={Style.orgsContainer}
                                                  >
                                                      {ciInfo.data[currentYear][
                                                          category.id
                                                      ].orgs.most_profitable.map((org, index) => (
                                                          <Text key={org.org} style={Style.orgName}>
                                                              {`${
                                                                  index < 9
                                                                      ? ` ${index + 1}`
                                                                      : index + 1
                                                              }) ${
                                                                  org.org
                                                              } (Выручка ${convertNumber(
                                                                  org.revenues,
                                                                  {
                                                                      postfix: '₽',
                                                                      useShortVersion: true,
                                                                  }
                                                              )})`}
                                                          </Text>
                                                      ))}
                                                  </Space>
                                              </Space>
                                          ) : undefined}
                                      </Space>
                                  )
                              )
                            : undefined}
                    </Space>
                </div>
            </div>
        )
    }
}

CI.propTypes = {
    ciInfo: PropTypes.object,
    cities: PropTypes.object,
    categories: PropTypes.object,
    getCICategories: PropTypes.func.isRequired,
    getCIInfo: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    settings: PropTypes.object,
}

CI.defaultProps = {
    ciInfo: {},
    cities: {},
    categories: {},
    settings: {},
}

export default connect(
    (state) => ({
        ciInfo: state.calculations[pagesState.CI_PAGE].ciInfo,
        cities: state.calculations[pagesState.CI_PAGE].cities,
        categories: state.calculations[pagesState.CI_PAGE].categories,
        settings: state.settings,
    }),
    (dispatch) => ({
        getCICategories: () => dispatch(actions.getCICategories()),
        getCIInfo: (city) => dispatch(actions.getCIInfo(city)),
        getCities: () => dispatch(actions.getCities(pagesState.CI_PAGE)),
    })
)(CI)
