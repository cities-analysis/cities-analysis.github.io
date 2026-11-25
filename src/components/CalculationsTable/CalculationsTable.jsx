import React, { Component } from 'react'
import { Table, Space, Tooltip, Radio, Spin, Empty, Select, Typography } from 'antd'
import PropTypes from 'prop-types'
import Style from './Style'
import { convertNumber } from '../../utils/CommonConverter'

const { Text } = Typography

const commonColumns = (withYear, filters, activeFilters) => ({
    title: withYear ? 'Год' : 'Город',
    dataIndex: withYear ? 'year' : 'city',
    key: withYear ? 'year' : 'city',
    width: 120,
    fixed: 'left',
    align: 'center',
    filters,
    onFilter: (value, record) => (withYear ? record.year === value : record.city === value),
    filterSearch: true,
    render: (value, row) => {
        if (withYear) return value
        if (row.is_monotown)
            return (
                <Tooltip title='Моногород'>
                    <b>{value}</b>
                </Tooltip>
            )
        return value
    },
    filteredValue: withYear ? activeFilters?.year : activeFilters?.city,
})

const columnsOrgs = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Количество зарегистрированных компаний'>
                <span>Зарег-ные</span>
            </Tooltip>
        ),
        dataIndex: 'registered',
        key: 'registered',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.registered - b.registered,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Количество ликвидированных компаний'>
                <span>Ликв-ые</span>
            </Tooltip>
        ),
        dataIndex: 'liquidated',
        key: 'liquidated',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.liquidated - b.liquidated,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Количество действующих компаний'>
                <span>Действующие</span>
            </Tooltip>
        ),
        key: 'existing',
        dataIndex: 'existing',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.existing - b.existing,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Суммарная выручка всех компаний в городе'>
                <span>Выручка</span>
            </Tooltip>
        ),
        key: 'revenues',
        dataIndex: 'revenues',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.revenues - b.revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма основных средства всех компаний в городе'>
                <span>Основные средства</span>
            </Tooltip>
        ),
        key: 'fixed_assets',
        dataIndex: 'fixed_assets',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.fixed_assets - b.fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма зарплат всех компаний в городе'>
                <span>Зарплата</span>
            </Tooltip>
        ),
        key: 'wages',
        dataIndex: 'wages',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.wages - b.wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
]

const columnsOrgsCI = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Количество зарегистрированных компаний (КИ)'>
                <span>Зарег-ные (КИ)</span>
            </Tooltip>
        ),
        dataIndex: 'registered_ci',
        key: 'registered_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.registered_ci - b.registered_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Количество ликвидированных компаний (КИ)'>
                <span>Ликв-ые (КИ)</span>
            </Tooltip>
        ),
        dataIndex: 'liquidated_ci',
        key: 'liquidated_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.liquidated_ci - b.liquidated_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Количество действующих компаний (КИ)'>
                <span>Действующие (КИ)</span>
            </Tooltip>
        ),
        key: 'existing_ci',
        dataIndex: 'existing_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.existing_ci - b.existing_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Суммарная выручка всех компаний в городе (КИ)'>
                <span>Выручка (КИ)</span>
            </Tooltip>
        ),
        key: 'revenues_ci',
        dataIndex: 'revenues_ci',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.revenues_ci - b.revenues_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма основных средства всех компаний в городе (КИ)'>
                <span>Основные средства (КИ)</span>
            </Tooltip>
        ),
        key: 'fixed_assets_ci',
        dataIndex: 'fixed_assets_ci',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.fixed_assets_ci - b.fixed_assets_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма зарплат всех компаний в городе (КИ)'>
                <span>Зарплата (КИ)</span>
            </Tooltip>
        ),
        key: 'wages_ci',
        dataIndex: 'wages_ci',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.wages_ci - b.wages_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
]

const columnsCalculated = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по выручке'>
                <span>HHI - выручка</span>
            </Tooltip>
        ),
        key: 'hhi_revenues',
        dataIndex: 'hhi_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_revenues - b.hhi_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по основным средствам'>
                <span>HHI - основные средства</span>
            </Tooltip>
        ),
        key: 'hhi_fixed_assets',
        dataIndex: 'hhi_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_fixed_assets - b.hhi_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по зарплатам'>
                <span>HHI - зарплата</span>
            </Tooltip>
        ),
        key: 'hhi_wages',
        dataIndex: 'hhi_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_wages - b.hhi_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по выручке'>
                <span>Тейл - выручка</span>
            </Tooltip>
        ),
        key: 'ti_revenues',
        dataIndex: 'ti_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_revenues - b.ti_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по основным средствам'>
                <span>Тейл - основные средства</span>
            </Tooltip>
        ),
        key: 'ti_fixed_assets',
        dataIndex: 'ti_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_fixed_assets - b.ti_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по зарплатам'>
                <span>Тейл - зарплата</span>
            </Tooltip>
        ),
        key: 'ti_wages',
        dataIndex: 'ti_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_wages - b.ti_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='DEA'>
                <span>DEA</span>
            </Tooltip>
        ),
        key: 'dea',
        dataIndex: 'dea',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.dea - b.dea,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
]

const columnsCalculatedCI = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по выручке (КИ)'>
                <span>HHI - выручка (КИ)</span>
            </Tooltip>
        ),
        key: 'hhi_revenues_ci',
        dataIndex: 'hhi_revenues_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_revenues_ci - b.hhi_revenues_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по основным средствам (КИ)'>
                <span>HHI - основные средства (КИ)</span>
            </Tooltip>
        ),
        key: 'hhi_fixed_assets_ci',
        dataIndex: 'hhi_fixed_assets_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_fixed_assets_ci - b.hhi_fixed_assets_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по зарплатам (КИ)'>
                <span>HHI - зарплата (КИ)</span>
            </Tooltip>
        ),
        key: 'hhi_wages_ci',
        dataIndex: 'hhi_wages_ci',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_wages_ci - b.hhi_wages_ci,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
]

const columnsEconomical = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Отгружено товаров собственного производства'>
                <span>Отгружено товаров</span>
            </Tooltip>
        ),
        key: 'export',
        dataIndex: 'export',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.export - b.export,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Инвестиции в основной капитал'>
                <span>Инвестиции</span>
            </Tooltip>
        ),
        key: 'investments',
        dataIndex: 'investments',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.investments - b.investments,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Продукция сельского хозяйства'>
                <span>Сельхоз</span>
            </Tooltip>
        ),
        key: 'agriculture',
        dataIndex: 'agriculture',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.agriculture - b.agriculture,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Объём социальных выплат'>
                <span>Соц выплаты</span>
            </Tooltip>
        ),
        key: 'social_payments',
        dataIndex: 'social_payments',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.social_payments - b.social_payments,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Оборот розничной торговли'>
                <span>Розница</span>
            </Tooltip>
        ),
        key: 'retails',
        dataIndex: 'retails',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.retails - b.retails,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Объем платных услуг населению'>
                <span>Плат услуги</span>
            </Tooltip>
        ),
        key: 'paid_services',
        dataIndex: 'paid_services',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.paid_services - b.paid_services,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Оборот общественного питания'>
                <span>Обществ питание</span>
            </Tooltip>
        ),
        key: 'catering',
        dataIndex: 'catering',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.catering - b.catering,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Доходы муниципального бюджета'>
                <span>Доходы бюджета</span>
            </Tooltip>
        ),
        key: 'budget_revenues',
        dataIndex: 'budget_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.budget_revenues - b.budget_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Расходы муниципального бюджета'>
                <span>Расходы бюджета</span>
            </Tooltip>
        ),
        key: 'budget_expenses',
        dataIndex: 'budget_expenses',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.budget_expenses - b.budget_expenses,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Удельный вес убыточных предприятий'>
                <span>Убыточ предприятия</span>
            </Tooltip>
        ),
        key: 'unprofitable',
        dataIndex: 'unprofitable',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.unprofitable - b.unprofitable,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '%' }),
    },
]

const columnsSocial = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Численность населения в городе'>
                <span>Население</span>
            </Tooltip>
        ),
        key: 'population',
        dataIndex: 'population',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.population - b.population,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Миграция'>
                <span>Миграция</span>
            </Tooltip>
        ),
        key: 'migration',
        dataIndex: 'migration',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.migration - b.migration,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Миграция на 1000 жителей'>
                <span>Миграция/1000 чел</span>
            </Tooltip>
        ),
        key: 'migration_per_1000',
        dataIndex: 'migration_per_1000',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.migration_per_1000 - b.migration_per_1000,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Естественный прирост'>
                <span>Ест прирост</span>
            </Tooltip>
        ),
        key: 'natural_growth',
        dataIndex: 'natural_growth',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.natural_growth - b.natural_growth,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Площадь города'>
                <span>Площадь</span>
            </Tooltip>
        ),
        key: 'area',
        dataIndex: 'area',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.area - b.area,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'км^2' }),
    },
    {
        title: (
            <Tooltip title='Плотность населения'>
                <span>Плотность</span>
            </Tooltip>
        ),
        key: 'population_density',
        dataIndex: 'population_density',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.population_density - b.population_density,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел./км^2' }),
    },
    {
        title: (
            <Tooltip title='Среднесписочная численность работников предприятий'>
                <span>Работники</span>
            </Tooltip>
        ),
        key: 'employees',
        dataIndex: 'employees',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.employees - b.employees,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Число больничных учреждений'>
                <span>Больницы</span>
            </Tooltip>
        ),
        key: 'hospitals',
        dataIndex: 'hospitals',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hospitals - b.hospitals,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Число больничных коек'>
                <span>Больнич койки</span>
            </Tooltip>
        ),
        key: 'med_beds',
        dataIndex: 'med_beds',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.med_beds - b.med_beds,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
]

const columnsOther = (withYear, filters, activeFilters) => [
    commonColumns(withYear, filters, activeFilters),
    {
        title: (
            <Tooltip title='Число государственных и муниципальных дневных общеобразовательных учреждений'>
                <span>Школы</span>
            </Tooltip>
        ),
        key: 'schools',
        dataIndex: 'schools',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.schools - b.schools,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Число дошкольных образовательных учреждений'>
                <span>ДОУ</span>
            </Tooltip>
        ),
        key: 'preschools',
        dataIndex: 'preschools',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.preschools - b.preschools,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Численность учащихся в гос и мун дневных общеобр учреждениях'>
                <span>Учащиеся</span>
            </Tooltip>
        ),
        key: 'students',
        dataIndex: 'students',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.students - b.students,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Численность воспитанников ДОУ на 100 мест'>
                <span>Воспитанники ДОУ/100 мест</span>
            </Tooltip>
        ),
        key: 'preschool_students',
        dataIndex: 'preschool_students',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.preschool_students - b.preschool_students,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: 'чел.' }),
    },
    {
        title: (
            <Tooltip title='Выброшено в атмосферу загрязняющих веществ, тонна'>
                <span>Загряз воздуха</span>
            </Tooltip>
        ),
        key: 'air_pollution',
        dataIndex: 'air_pollution',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.air_pollution - b.air_pollution,
        showSorterTooltip: false,
        render: (value) => value,
    },
    {
        title: (
            <Tooltip title='Модель управления'>
                <span>Модель управления</span>
            </Tooltip>
        ),
        key: 'executive_model',
        dataIndex: 'executive_model',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.executive_model.localeCompare(b.executive_model),
        showSorterTooltip: false,
        render: (value) => value,
    },
    {
        title: (
            <Tooltip title='Число лицензий'>
                <span>Лицензии</span>
            </Tooltip>
        ),
        key: 'licences',
        dataIndex: 'licences',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.licences - b.licences,
        showSorterTooltip: false,
        render: (value) => value,
    },
    {
        title: (
            <Tooltip title='Число патенты'>
                <span>Патенты</span>
            </Tooltip>
        ),
        key: 'patents',
        dataIndex: 'patents',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.patents - b.patents,
        showSorterTooltip: false,
        render: (value) => value,
    },
    {
        title: (
            <Tooltip title='Число медицинских организаций'>
                <span>Мед организации</span>
            </Tooltip>
        ),
        key: 'med_orgs',
        dataIndex: 'med_orgs',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.med_orgs - b.med_orgs,
        showSorterTooltip: false,
        render: (value) => value,
    },
    {
        title: (
            <Tooltip title='Число зарегистрированных дел по безработице'>
                <span>Безработица</span>
            </Tooltip>
        ),
        key: 'unemployment',
        dataIndex: 'unemployment',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.unemployment - b.unemployment,
        showSorterTooltip: false,
        render: (value) => value,
    },
]

const columnsRegion = (withYear, filters, activeFilters) => [
    {
        title: withYear ? 'Год' : 'Регион',
        dataIndex: withYear ? 'year' : 'region',
        key: withYear ? 'year' : 'region',
        width: 120,
        fixed: 'left',
        align: 'center',
        filters,
        onFilter: (value, record) => (withYear ? record.year === value : record.region === value),
        filterSearch: true,
        filteredValue: withYear ? activeFilters?.year : activeFilters?.region,
    },
    {
        title: (
            <Tooltip title='Суммарная выручка всех компаний в области'>
                <span>Выручка</span>
            </Tooltip>
        ),
        key: 'revenues',
        dataIndex: 'revenues',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.revenues - b.revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма основных средства всех компаний в области'>
                <span>Основные средства</span>
            </Tooltip>
        ),
        key: 'fixed_assets',
        dataIndex: 'fixed_assets',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.fixed_assets - b.fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Сумма зарплат всех компаний в области'>
                <span>Зарплата</span>
            </Tooltip>
        ),
        key: 'wages',
        dataIndex: 'wages',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.wages - b.wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { postfix: '₽' }),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по выручке'>
                <span>HHI - выручка</span>
            </Tooltip>
        ),
        key: 'hhi_revenues',
        dataIndex: 'hhi_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_revenues - b.hhi_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по основным средствам'>
                <span>HHI - основные средства</span>
            </Tooltip>
        ),
        key: 'hhi_fixed_assets',
        dataIndex: 'hhi_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_fixed_assets - b.hhi_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Херфиндаля — Хиршмана по зарплатам'>
                <span>HHI - зарплата</span>
            </Tooltip>
        ),
        key: 'hhi_wages',
        dataIndex: 'hhi_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.hhi_wages - b.hhi_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по выручке'>
                <span>Тейл - выручка</span>
            </Tooltip>
        ),
        key: 'ti_revenues',
        dataIndex: 'ti_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_revenues - b.ti_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-between по выручке'>
                <span>Тейл-b - выручка</span>
            </Tooltip>
        ),
        key: 'ti_b_revenues',
        dataIndex: 'ti_b_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_b_revenues - b.ti_b_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-within по выручке'>
                <span>Тейл-w - выручка</span>
            </Tooltip>
        ),
        key: 'ti_w_revenues',
        dataIndex: 'ti_w_revenues',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_w_revenues - b.ti_w_revenues,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по основным средствам'>
                <span>Тейл - основные средства</span>
            </Tooltip>
        ),
        key: 'ti_fixed_assets',
        dataIndex: 'ti_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_fixed_assets - b.ti_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-between по основным средствам'>
                <span>Тейл-b - основные средства</span>
            </Tooltip>
        ),
        key: 'ti_b_fixed_assets',
        dataIndex: 'ti_b_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_b_fixed_assets - b.ti_b_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-within по основным средствам'>
                <span>Тейла-w - основные средства</span>
            </Tooltip>
        ),
        key: 'ti_w_fixed_assets',
        dataIndex: 'ti_w_fixed_assets',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_w_fixed_assets - b.ti_w_fixed_assets,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла по зарплатам'>
                <span>Тейл - зарплата</span>
            </Tooltip>
        ),
        key: 'ti_wages',
        dataIndex: 'ti_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_wages - b.ti_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-between по зарплатам'>
                <span>Тейл-b - зарплата</span>
            </Tooltip>
        ),
        key: 'ti_b_wages',
        dataIndex: 'ti_b_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_b_wages - b.ti_b_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
    {
        title: (
            <Tooltip title='Индекс Тейла-within по зарплатам'>
                <span>Тейл-w - зарплата</span>
            </Tooltip>
        ),
        key: 'ti_w_wages',
        dataIndex: 'ti_w_wages',
        width: 100,
        align: 'center',
        sorter: (a, b) => a.ti_w_wages - b.ti_w_wages,
        showSorterTooltip: false,
        render: (value) => convertNumber(value, { precision: 4 }),
    },
]

const PARAMETERS_TYPES = [
    { id: 'orgs', title: 'Показатели предприятий' },
    { id: 'orgs_ci', title: 'Показатели предприятий (КИ)' },
    { id: 'calc', title: 'Расчётные показатели' },
    { id: 'calc_ci', title: 'Расчётные показатели (КИ)' },
    { id: 'econ', title: 'Экономические показатели' },
    { id: 'social', title: 'Социальные показатели' },
    { id: 'other', title: 'Прочие' },
]

const DEFAULT_STATE = {
    searchBy: 'year',
    year: undefined,
    city: undefined,
    region: undefined,
    shouldGetCalculations: true,
    parametersType: PARAMETERS_TYPES[0],
    previouslySelectedYear: undefined,
    previouslySelectedCity: undefined,
    previouslySelectedRegion: undefined,
    activeFilters: undefined,
}

class CalculationsTable extends Component {
    constructor(props) {
        super(props)
        this.state = DEFAULT_STATE
    }

    componentDidMount() {
        this.loadInformation()
    }

    componentDidUpdate(p, s, ss) {
        const { settings } = this.props
        if (settings.isRegion !== p.settings.isRegion) {
            this.setState({ shouldGetCalculations: true, activeFilters: undefined })
            this.loadInformation()
        }
        if (settings.indexed !== p.settings.indexed) {
            const { year, searchBy, region, city } = this.state
            this.setState({
                shouldGetCalculations: true,
                previouslySelectedYear: searchBy === 'year' ? year : undefined,
                previouslySelectedRegion:
                    searchBy === 'city/region' && settings.isRegion ? region : undefined,
                previouslySelectedCity:
                    searchBy === 'city/region' && !settings.isRegion ? city : undefined,
            })
        }
        if (
            !settings.isRegion &&
            this.props.cities?.data?.length > 0 &&
            this.props.cityYears?.data?.length > 0 &&
            this.state.shouldGetCalculations
        ) {
            const { previouslySelectedYear, previouslySelectedCity } = this.state
            const year = previouslySelectedYear ?? this.props.cityYears.data[0]
            const city = previouslySelectedCity ?? this.props.cities.data[0]
            this.setState({
                year,
                city,
                shouldGetCalculations: false,
                previouslySelectedYear: undefined,
                previouslySelectedCity: undefined,
            })
            if (this.state.searchBy === 'year') this.loadCalculations({ year })
            else this.loadCalculations({ city })
        }
        if (
            settings.isRegion &&
            this.props.regions?.data?.length > 0 &&
            this.props.regionYears?.data?.length > 0 &&
            this.state.shouldGetCalculations
        ) {
            const { previouslySelectedYear, previouslySelectedRegion } = this.state
            const year = previouslySelectedYear ?? this.props.regionYears.data[0]
            const region = previouslySelectedRegion ?? this.props.regions.data[0]
            this.setState({
                year,
                region,
                shouldGetCalculations: false,
                previouslySelectedYear: undefined,
                previouslySelectedRegion: undefined,
            })
            if (this.state.searchBy === 'year') this.loadCalculations({ year })
            else this.loadCalculations({ region })
        }
    }

    loadInformation() {
        const { settings, getYears, getRegions, getCities } = this.props
        getYears(settings.isRegion)
        if (settings.isRegion) getRegions()
        else getCities()
    }

    loadCalculations({ year, city, region }) {
        const { settings, getCalculations } = this.props
        const isRegion = settings?.isRegion
        getCalculations(year, isRegion ? undefined : city, isRegion ? region : undefined, isRegion)
    }

    render() {
        const { cities, regions, cityYears, regionYears, calculations } = this.props
        const { city, region, year, searchBy, parametersType, activeFilters } = this.state
        const isRegion = this.props.settings?.isRegion
        const isLoading =
            regions?.isLoading ||
            cities?.isLoading ||
            cityYears?.isLoading ||
            regionYears?.isLoading ||
            calculations?.isLoading
        if (isLoading)
            return (
                <div style={Style.container}>
                    <Spin size='large' tip='Загрузка рассчитанных показателей' />
                </div>
            )
        if (!calculations?.data?.length)
            return (
                <div style={Style.container}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description='Не найдено показателей'
                    />
                </div>
            )
        if (
            (isRegion && calculations?.data?.[0]?.city) ||
            (!isRegion && calculations?.data?.[0]?.region)
        )
            return undefined
        let columns = columnsRegion
        if (!isRegion) {
            switch (parametersType.id) {
                case PARAMETERS_TYPES[0].id:
                    columns = columnsOrgs
                    break
                case PARAMETERS_TYPES[1].id:
                    columns = columnsOrgsCI
                    break
                case PARAMETERS_TYPES[2].id:
                    columns = columnsCalculated
                    break
                case PARAMETERS_TYPES[3].id:
                    columns = columnsCalculatedCI
                    break
                case PARAMETERS_TYPES[4].id:
                    columns = columnsEconomical
                    break
                case PARAMETERS_TYPES[5].id:
                    columns = columnsSocial
                    break
                case PARAMETERS_TYPES[6].id:
                    columns = columnsOther
                    break
                default:
                    break
            }
        }
        return (
            <div style={Style.container}>
                <Space direction='vertical'>
                    {!isRegion ? (
                        <Space direction='horizontal'>
                            <Text style={Style.parameterTitle}>Отображение параметров:</Text>
                            <Select
                                style={Style.selectParametersType}
                                value={parametersType.title}
                                onChange={(type) =>
                                    this.setState({
                                        parametersType: PARAMETERS_TYPES.find(
                                            (t) => t.title === type
                                        ),
                                    })
                                }
                            >
                                {PARAMETERS_TYPES.map((type) => (
                                    <Select.Option key={type.id} value={type.title}>
                                        {type.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Space>
                    ) : undefined}
                    {((!isRegion && city) || (isRegion && region)) &&
                    year &&
                    (!calculations?.isLoading || calculations?.data?.length) ? (
                        <Space direction='horizontal'>
                            <Radio.Group
                                onChange={(event) => {
                                    this.setState({
                                        searchBy: event.target.value,
                                        activeFilters: undefined,
                                    })
                                    if (event.target.value === 'year')
                                        this.loadCalculations({ year })
                                    if (event.target.value === 'city/region')
                                        this.loadCalculations({ city, region })
                                }}
                                value={searchBy}
                            >
                                <Space direction='vertical'>
                                    <Radio value='year'>Расчёты за год:</Radio>
                                    <Radio value='city/region'>
                                        {isRegion ? 'Расчёты в регионе:' : 'Расчёты в городе:'}
                                    </Radio>
                                </Space>
                            </Radio.Group>
                            <Space direction='vertical'>
                                <Select
                                    style={Style.select}
                                    value={year}
                                    showSearch
                                    placeholder='Год'
                                    disabled={searchBy !== 'year'}
                                    onChange={(_y) => {
                                        this.setState({ year: _y })
                                        if (_y !== year) this.loadCalculations({ year: _y })
                                    }}
                                    filterOption={(input, option) =>
                                        option?.value
                                            ?.toString()
                                            ?.toLowerCase()
                                            ?.includes(input.toLowerCase())
                                    }
                                >
                                    {isRegion
                                        ? regionYears?.data?.map((_y) => (
                                              <Select.Option key={_y} value={_y}>
                                                  {_y}
                                              </Select.Option>
                                          ))
                                        : cityYears?.data?.map((_y) => (
                                              <Select.Option key={_y} value={_y}>
                                                  {_y}
                                              </Select.Option>
                                          ))}
                                </Select>
                                <Select
                                    style={isRegion ? Style.selectRegion : Style.selectCity}
                                    value={isRegion ? region : city}
                                    showSearch
                                    placeholder={isRegion ? 'Регион' : 'Город'}
                                    disabled={searchBy !== 'city/region'}
                                    onChange={(cr) => {
                                        if (isRegion) this.setState({ region: cr })
                                        else this.setState({ city: cr })
                                        if (
                                            (!isRegion && cr !== city) ||
                                            (isRegion && cr !== region)
                                        )
                                            this.loadCalculations({ city: cr, region: cr })
                                    }}
                                    filterOption={(input, option) =>
                                        option?.value
                                            ?.toString()
                                            ?.toLowerCase()
                                            ?.includes(input.toLowerCase())
                                    }
                                >
                                    {isRegion
                                        ? regions?.data?.map((_r) => (
                                              <Select.Option key={_r} value={_r}>
                                                  {_r}
                                              </Select.Option>
                                          ))
                                        : cities?.data?.map((_c) => (
                                              <Select.Option key={_c} value={_c}>
                                                  {_c}
                                              </Select.Option>
                                          ))}
                                </Select>
                            </Space>
                        </Space>
                    ) : undefined}
                </Space>
                <br />
                <br />
                <br />
                {calculations?.data?.length > 0 ? (
                    <Table
                        columns={columns(
                            searchBy === 'city/region',
                            calculations?.data?.map((row) => ({
                                text:
                                    searchBy === 'city/region' ? row.year : row.city || row.region,
                                value:
                                    searchBy === 'city/region' ? row.year : row.city || row.region,
                            })),
                            activeFilters
                        )}
                        dataSource={calculations?.data?.map((row) => ({
                            ...row,
                            key: (row.year ?? '') + (row.city ?? '') + (row.region ?? ''),
                        }))}
                        pagination={{
                            pageSize: 25,
                            showSizeChanger: false,
                        }}
                        scroll={{
                            y: 700,
                            x: 1000,
                        }}
                        onChange={(_, filters) => this.setState({ activeFilters: filters })}
                    />
                ) : undefined}
            </div>
        )
    }
}

CalculationsTable.propTypes = {
    settings: PropTypes.object,
    regions: PropTypes.object,
    cities: PropTypes.object,
    cityYears: PropTypes.object,
    regionYears: PropTypes.object,
    calculations: PropTypes.object,
    getCities: PropTypes.func.isRequired,
    getRegions: PropTypes.func.isRequired,
    getYears: PropTypes.func.isRequired,
    getCalculations: PropTypes.func.isRequired,
}

CalculationsTable.defaultProps = {
    settings: {},
    regions: {},
    cities: {},
    cityYears: {},
    regionYears: {},
    calculations: {},
}

export default CalculationsTable
