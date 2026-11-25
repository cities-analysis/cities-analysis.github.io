#!/usr/bin/env python3
"""Собирает статические JSON-файлы для сайта из CSV приватного репозитория данных.

Заменяет бывший Django API (PythonAnywhere): каждый запрос, который раньше шёл на сервер,
здесь заранее считается и сохраняется в файл public/data/....

Использование:
    python scripts/build_data.py <папка-приватного-репозитория> [папка-вывода]
По умолчанию вывод идёт в public/data.
"""
import ast
import json
import math
import shutil
import sys
from pathlib import Path

import pandas as pd

SRC = Path(sys.argv[1]).resolve()
OUT = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent / 'public' / 'data'
UPLOAD = SRC / 'upload'
BACKEND = SRC / 'backend' / 'cities_analysis'

FOLDERS = {False: 'raw', True: 'indexed'}

INT_COLUMNS = [
    'registered', 'liquidated', 'existing', 'revenues', 'fixed_assets', 'wages', 'population', 'natural_growth',
    'export', 'investments', 'migration', 'agriculture', 'retails', 'social_payments', 'paid_services', 'catering',
    'budget_revenues', 'budget_expenses', 'employees', 'hospitals', 'med_beds', 'schools', 'preschools', 'students',
    'preschool_students', 'licences', 'med_orgs', 'patents', 'unemployment',
]
STR_COLUMNS = ['executive_model', 'most_profitable']

REGION_FIELDS = [
    'revenues', 'fixed_assets', 'wages', 'hhi_revenues', 'hhi_fixed_assets', 'hhi_wages',
    'ti_revenues', 'ti_b_revenues', 'ti_w_revenues', 'ti_fixed_assets', 'ti_b_fixed_assets', 'ti_w_fixed_assets',
    'ti_wages', 'ti_b_wages', 'ti_w_wages',
]
CI_FIELDS = [
    'registered', 'liquidated', 'existing', 'revenues', 'fixed_assets', 'wages',
    'hhi_revenues', 'hhi_fixed_assets', 'hhi_wages',
]
COMMON_FIELDS = [
    'registered', 'liquidated', 'existing',
    'revenues', 'fixed_assets', 'wages', 'hhi_revenues', 'hhi_fixed_assets', 'hhi_wages',
    'ti_revenues', 'ti_fixed_assets', 'ti_wages', 'dea', 'population', 'natural_growth', 'export', 'investments',
    'migration', 'migration_per_1000', 'area', 'population_density', 'agriculture', 'retails', 'social_payments',
    'paid_services', 'catering', 'budget_revenues', 'budget_expenses', 'employees', 'hospitals', 'med_beds',
    'schools', 'preschools', 'students', 'preschool_students', 'unprofitable', 'air_pollution', 'executive_model',
    'licences', 'med_orgs', 'patents', 'unemployment',
]
CITY_CHART_PARAMS = [
    'registered', 'liquidated', 'existing', 'registered_ci', 'liquidated_ci', 'existing_ci',
    'revenues', 'fixed_assets', 'wages', 'hhi_revenues', 'hhi_fixed_assets', 'hhi_wages',
    'revenues_ci', 'fixed_assets_ci', 'wages_ci', 'hhi_revenues_ci', 'hhi_fixed_assets_ci', 'hhi_wages_ci',
    'ti_revenues', 'ti_fixed_assets', 'ti_wages', 'dea',
    'population', 'natural_growth', 'export', 'investments', 'migration', 'migration_per_1000',
    'area', 'population_density', 'agriculture', 'retails', 'social_payments',
    'paid_services', 'catering', 'budget_revenues', 'budget_expenses', 'employees', 'hospitals',
    'med_beds', 'schools', 'preschools', 'students', 'preschool_students', 'unprofitable',
    'air_pollution', 'executive_model', 'licences', 'med_orgs', 'patents', 'unemployment',
]


def load_dict(path, name):
    """Читает словарь-константу из .py файла бэкенда, не выполняя код."""
    for node in ast.parse(path.read_text(encoding='utf-8')).body:
        if isinstance(node, ast.Assign) and any(getattr(t, 'id', None) == name for t in node.targets):
            return ast.literal_eval(node.value)
    raise KeyError(name)


COLUMN_NAMES = load_dict(BACKEND / 'api' / 'calculations.py', 'COLUMNS_NAMES_CITIES')
CITY_COORDS = json.loads((UPLOAD / 'city_coordinates.json').read_text(encoding='utf-8'))
REGION_COORDS = load_dict(BACKEND / 'regions_coordinates.py', 'regions_coordinates')


def read_csv(name):
    df = pd.read_csv(UPLOAD / name, low_memory=False)
    df = df[~df['temp_block'].astype(bool)].copy()
    df['indexed'] = df['indexed'].astype(bool)
    for column in STR_COLUMNS:
        if column in df:
            df[column] = df[column].fillna('').astype(str)
    for column in df.columns:
        if column in ('city', 'region', 't', 'temp_block', 'indexed') or column in STR_COLUMNS:
            continue
        df[column] = df[column].fillna(0)
        if column in INT_COLUMNS or column == 'year':
            df[column] = df[column].round().astype('int64')
    return df


def clean(value):
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return 0
    if hasattr(value, 'item'):
        return value.item()
    return value


def records(df, columns):
    return [{c: clean(v) for c, v in zip(columns, row)} for row in df[columns].itertuples(index=False, name=None)]


def dump(path, payload):
    path = OUT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')


def build_ci_info(ci_df, common_df, categories, city):
    """Копия логики эндпоинта /calculations/ci."""
    def for_year(frame, year, is_orgs=False, include_hhi=False):
        rows = frame[frame['year'] == year]
        if len(rows) != 1:
            return {}
        row = {k: clean(v) for k, v in rows.iloc[0].items()}
        res = {'registered': row['registered'], 'liquidated': row['liquidated'], 'existing': row['existing']}
        if is_orgs:
            res.update(revenues=row['revenues'], fixed_assets=row['fixed_assets'], wages=row['wages'])
        if include_hhi:
            res.update(hhi_revenues=row['hhi_revenues'], hhi_fixed_assets=row['hhi_fixed_assets'],
                       hhi_wages=row['hhi_wages'])
        if 'most_profitable' in row:
            most_profitable = []
            if len(row['most_profitable']) > 0:
                for org in row['most_profitable'].split('$$$'):
                    values = org.split('~~~')
                    most_profitable.append({'org': values[0], 'revenues': math.floor(float(values[1]))})
            res['most_profitable'] = most_profitable
        return res

    years = sorted(ci_df['year'].unique().tolist())
    by_t = {t: g for t, g in ci_df.groupby('t')}
    empty = ci_df.iloc[0:0]
    result = {}
    ci_frame = by_t.get('CI', empty)
    # для общего блока 'ci' в ответе есть most_profitable только если колонка есть у кадра
    for year in years:
        result[str(year)] = {
            'common': for_year(common_df.drop(columns=['most_profitable'], errors='ignore'), year, True, True),
            'ci': for_year(ci_frame, year, True, True),
        }
    for key in categories:
        orgs = by_t.get(f'ORGS_CI_{key.upper()}', empty)
        ip = by_t.get(f'IP_CI_{key.upper()}', empty).drop(columns=['most_profitable'], errors='ignore')
        for year in years:
            result[str(year)][key] = {'orgs': for_year(orgs, year, True), 'ip': for_year(ip, year)}
    return result


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    city_df = read_csv('city_calculations.csv')
    region_df = read_csv('region_calculations.csv')
    ci_dfs = {'old': read_csv('city_ci_calculations.csv'), 'new': read_csv('new_city_ci_calculations.csv')}
    # Необновляемые эндпоинты (карта, графики) раньше работали с «старой» версией КИ
    ci_main = ci_dfs['old']

    cities = sorted(city_df['city'].unique().tolist())
    regions = sorted(region_df['region'].unique().tolist())
    dump('cities.json', {'cities': cities})
    dump('regions.json', {'regions': regions})
    dump('years_city.json', {'years': sorted(city_df['year'].unique().tolist())})
    dump('years_region.json', {'years': sorted(region_df['year'].unique().tolist())})

    OUT.mkdir(parents=True, exist_ok=True)
    for version in ci_dfs:
        shutil.copyfile(UPLOAD / f'ci_categories_{version}.json', OUT / f'ci_categories_{version}.json')

    for indexed, folder in FOLDERS.items():
        cities_ix = city_df[city_df['indexed'] == indexed].sort_values(['city', 'year'])
        regions_ix = region_df[region_df['indexed'] == indexed].sort_values(['region', 'year'])
        ci_ix = ci_main[(ci_main['indexed'] == indexed) & (ci_main['t'] == 'CI')]

        # --- карта
        ci_lookup = {(r.city, r.year): r for r in ci_ix.itertuples(index=False)}
        for year in sorted(cities_ix['year'].unique().tolist()):
            rows = records(cities_ix[cities_ix['year'] == year], ['year', 'city'] + COMMON_FIELDS)
            for row in rows:
                row['is_monotown'] = False
                coords = CITY_COORDS.get(row['city'])
                row['latitude'] = coords['latitude'] if coords else None
                row['longitude'] = coords['longitude'] if coords else None
            dump(f'map/{folder}/city/{year}.json', {'calculations': rows})
            rows_ci = []
            for row in rows:
                item = dict(row)
                ci = ci_lookup.get((row['city'], year))
                for field in CI_FIELDS:
                    item[f'{field}_ci'] = clean(getattr(ci, field)) if ci is not None else 0
                rows_ci.append(item)
            dump(f'map/{folder}/city_ci/{year}.json', {'calculations': rows_ci})
        for year in sorted(regions_ix['year'].unique().tolist()):
            rows = records(regions_ix[regions_ix['year'] == year], ['year', 'region'] + REGION_FIELDS)
            for row in rows:
                coords = REGION_COORDS.get(row['region'])
                row['latitude'] = coords['latitude'] if coords else None
                row['longitude'] = coords['longitude'] if coords else None
            dump(f'map/{folder}/region/{year}.json', {'calculations': rows})

        # --- графики
        for param in CITY_CHART_PARAMS:
            is_ci = param.endswith('_ci')
            base = param[:-3] if is_ci else param
            frame = ci_ix.sort_values(['city', 'year']) if is_ci else cities_ix
            dump(f'chart/{folder}/{param}.json', {'calculations': [
                {'year': clean(y), base: clean(v), 'city': c}
                for y, v, c in frame[['year', base, 'city']].itertuples(index=False, name=None)
            ]})
            name = COLUMN_NAMES[base] + (' (КИ)' if is_ci else '')
            grouped = {c: g for c, g in frame.groupby('city')}
            multi = []
            for city in cities:
                g = grouped.get(city)
                values = [] if g is None else [
                    {'year': clean(y), 'value': clean(v), 'parameter': name}
                    for y, v in g.sort_values('year')[['year', base]].itertuples(index=False, name=None)
                ]
                multi.append({'city': city, 'values': values})
            dump(f'chart_multi/{folder}/{param}.json', {'calculations': multi})
        # --- страница КИ
        for version, ci_df in ci_dfs.items():
            categories = [c['id'] for c in json.loads((UPLOAD / f'ci_categories_{version}.json').read_text('utf-8'))['ci_categories']]
            ci_version_ix = ci_df[ci_df['indexed'] == indexed]
            ci_by_city = {c: g for c, g in ci_version_ix.groupby('city')}
            common_by_city = {c: g for c, g in cities_ix.groupby('city')}
            for city in cities:
                ci_city = ci_by_city.get(city, ci_version_ix.iloc[0:0])
                dump(f'ci/{version}/{folder}/{city}.json',
                     {'ci_calculations': build_ci_info(ci_city, common_by_city.get(city, cities_ix.iloc[0:0]), categories, city)})

    print('Готово:', sum(1 for _ in OUT.rglob('*.json')), 'файлов в', OUT)


if __name__ == '__main__':
    main()
