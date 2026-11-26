// Статические данные, собираемые из приватного репозитория при сборке сайта (scripts/build_data.py)
export const DATA_URL = `${process.env.PUBLIC_URL || ''}/data`

export const PARAMETERS = [
    {
        id: 'population',
        title: 'Население',
        postfix: 'чел.',
    },
    {
        id: 'export',
        title: 'Отгружено товаров',
        postfix: '₽',
    },
    {
        id: 'investments',
        title: 'Инвестиции',
        postfix: '₽',
    },
    {
        id: 'migration',
        title: 'Миграция',
        postfix: 'чел.',
    },
    {
        id: 'registered',
        title: 'Зарегистрированные',
    },
    {
        id: 'registered_ci',
        title: 'Зарегистрированные (КИ)',
    },
    {
        id: 'liquidated',
        title: 'Ликвидированные',
    },
    {
        id: 'liquidated_ci',
        title: 'Ликвидированные (КИ)',
    },
    {
        id: 'existing',
        title: 'Действующие',
    },
    {
        id: 'existing_ci',
        title: 'Действующие (КИ)',
    },
    {
        id: 'revenues',
        title: 'Выручка',
        postfix: '₽',
    },
    {
        id: 'revenues_ci',
        title: 'Выручка (КИ)',
        postfix: '₽',
    },
    {
        id: 'fixed_assets',
        title: 'Основные средства',
        postfix: '₽',
    },
    {
        id: 'fixed_assets_ci',
        title: 'Основные средства (КИ)',
        postfix: '₽',
    },
    {
        id: 'wages',
        title: 'Оплата труда',
        postfix: '₽',
    },
    {
        id: 'wages_ci',
        title: 'Оплата труда (КИ)',
        postfix: '₽',
    },
    {
        id: 'hhi_revenues',
        title: 'HHI по выручке',
    },
    {
        id: 'hhi_revenues_ci',
        title: 'HHI по выручке (КИ)',
    },
    {
        id: 'hhi_fixed_assets',
        title: 'HHI по основным средствам',
    },
    {
        id: 'hhi_fixed_assets_ci',
        title: 'HHI по основным средствам (КИ)',
    },
    {
        id: 'hhi_wages',
        title: 'HHI по оплате труда',
    },
    {
        id: 'hhi_wages_ci',
        title: 'HHI по оплате труда (КИ)',
    },
    {
        id: 'ssch',
        title: 'Среднесписочная численность (ССЧ)',
        postfix: 'чел.',
    },
    {
        id: 'ssch_ci',
        title: 'Среднесписочная численность (ССЧ) (КИ)',
        postfix: 'чел.',
    },
    {
        id: 'labor_productivity',
        title: 'Производительность труда',
        postfix: '₽',
    },
    {
        id: 'labor_productivity_ci',
        title: 'Производительность труда (КИ)',
        postfix: '₽',
    },
    {
        id: 'capital_labor_ratio',
        title: 'Трудовооруженность',
        postfix: '₽',
    },
    {
        id: 'capital_labor_ratio_ci',
        title: 'Трудовооруженность (КИ)',
        postfix: '₽',
    },
    {
        id: 'avg_labor_cost',
        title: 'Средняя оплата труда',
        postfix: '₽',
    },
    {
        id: 'avg_labor_cost_ci',
        title: 'Средняя оплата труда (КИ)',
        postfix: '₽',
    },
    {
        id: 'dea',
        title: 'DEA',
    },
]
