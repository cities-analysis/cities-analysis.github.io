import { put, all, takeLatest, takeEvery, select } from 'redux-saga/effects'
import {
    getCalculationsOnMapResponse,
    getCitiesResponse,
    getYearsResponse,
    getCalculationsForChartResponse,
    getCICategoriesResponse,
    getRegionsResponse,
    getCIInfoResponse,
} from '../redux/actions/calculations'
import {
    GET_CALCULATIONS_ON_MAP,
    GET_CALCULATIONS_FOR_CHART,
    GET_CITIES,
    GET_YEARS,
    GET_CI_CATEGORIES,
    GET_REGIONS,
    GET_CI_INFO,
} from '../redux/types'
import { DATA_URL } from '../constants'

const getJson = (path) =>
    fetch(`${DATA_URL}/${path}`).then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${path}`)
        return res.json()
    })

function* getCities(action) {
    try {
        const response = yield getJson('cities.json')
        yield put(getCitiesResponse(action.page, response?.cities ?? []))
    } catch (error) {
        yield put(getCitiesResponse(action.page, []))
    }
}

function* getRegions(action) {
    try {
        const response = yield getJson('regions.json')
        yield put(getRegionsResponse(action.page, response?.regions ?? []))
    } catch (error) {
        yield put(getCitiesResponse(action.page, []))
    }
}

function* getYears(action) {
    try {
        const response = yield getJson(`years_${action.isRegion ? 'region' : 'city'}.json`)
        yield put(getYearsResponse(action.page, response?.years ?? [], action.isRegion))
    } catch (error) {
        yield put(getYearsResponse(action.page, [], action.isRegion))
    }
}

function* getCIInfo(action) {
    try {
        const state = yield select()
        const { indexed, ciVersion } = state.settings
        const response = yield getJson(
            `ci/${ciVersion}/${indexed ? 'indexed' : 'raw'}/${encodeURIComponent(action.city)}.json`
        )
        yield put(getCIInfoResponse(response?.ci_calculations ?? {}))
    } catch (error) {
        yield put(getCIInfoResponse({}))
    }
}

function* getCalculationsOnMap(action) {
    try {
        const state = yield select()
        const isRegion = action.includeCI ? false : state.settings.isRegion
        const { indexed } = state.settings
        let kind = action.includeCI ? 'city_ci' : 'city'
        if (isRegion) kind = 'region'
        const response = yield getJson(
            `map/${indexed ? 'indexed' : 'raw'}/${kind}/${action.year}.json`
        )
        yield put(getCalculationsOnMapResponse(action.page, response?.calculations ?? []))
    } catch (error) {
        yield put(getCalculationsOnMapResponse(action.page, []))
    }
}

function* getCalculationsForChart(action) {
    try {
        const state = yield select()
        const { indexed } = state.settings
        const folder = indexed ? 'indexed' : 'raw'
        if (!action.parameters || action.parameters.length === 0) {
            yield put(getCalculationsForChartResponse([]))
            return
        }
        if (!action.isMultiParams) {
            const response = yield getJson(`chart/${folder}/${action.parameters}.json`)
            yield put(getCalculationsForChartResponse(response?.calculations ?? []))
            return
        }
        const responses = yield all(
            action.parameters.map((parameter) => getJson(`chart_multi/${folder}/${parameter}.json`))
        )
        const byCity = new Map()
        responses.forEach((response) => {
            ;(response?.calculations ?? []).forEach(({ city, values }) => {
                if (!byCity.has(city)) byCity.set(city, [])
                byCity.get(city).push(...values)
            })
        })
        yield put(
            getCalculationsForChartResponse(
                Array.from(byCity, ([city, values]) => ({ city, values }))
            )
        )
    } catch (error) {
        yield put(getCalculationsForChartResponse([]))
    }
}

function* getCICategories() {
    const state = yield select()
    const { ciVersion } = state.settings
    // eslint-disable-next-line camelcase
    const { ci_categories } = yield getJson(`ci_categories_${ciVersion}.json`)
    yield put(getCICategoriesResponse(ci_categories))
}

export default function* calculationsSaga() {
    yield all([
        takeLatest(GET_CITIES, getCities),
        takeLatest(GET_REGIONS, getRegions),
        takeEvery(GET_YEARS, getYears),
        takeLatest(GET_CI_INFO, getCIInfo),
        takeLatest(GET_CALCULATIONS_ON_MAP, getCalculationsOnMap),
        takeLatest(GET_CALCULATIONS_FOR_CHART, getCalculationsForChart),
        takeLatest(GET_CI_CATEGORIES, getCICategories),
    ])
}
