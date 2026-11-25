import { put, all, takeLatest, takeEvery, select } from 'redux-saga/effects'
import {
    getCalculationsResponse,
    getCalculationsOnMapResponse,
    getCitiesResponse,
    getYearsResponse,
    getCalculationsForChartResponse,
    getCICategoriesResponse,
    getRegionsResponse,
    getCIInfoResponse,
} from '../redux/actions/calculations'
import {
    GET_CALCULATIONS,
    GET_CALCULATIONS_ON_MAP,
    GET_CALCULATIONS_FOR_CHART,
    GET_CITIES,
    GET_YEARS,
    GET_CI_CATEGORIES,
    GET_REGIONS,
    GET_CI_INFO,
} from '../redux/types'
import { SERVER_APP } from '../constants'

const API = 'calculations'

function* getCities(action) {
    try {
        const response = yield fetch(`${SERVER_APP}/${API}/cities`).then((res) => res.json())
        yield put(getCitiesResponse(action.page, response?.cities ?? []))
    } catch (error) {
        yield put(getCitiesResponse(action.page, []))
    }
}

function* getRegions(action) {
    try {
        const response = yield fetch(`${SERVER_APP}/${API}/regions`).then((res) => res.json())
        yield put(getRegionsResponse(action.page, response?.regions ?? []))
    } catch (error) {
        yield put(getCitiesResponse(action.page, []))
    }
}

function* getYears(action) {
    try {
        const response = yield fetch(
            `${SERVER_APP}/${API}/years?is_region=${action.isRegion}`
        ).then((res) => res.json())
        yield put(getYearsResponse(action.page, response?.years ?? [], action.isRegion))
    } catch (error) {
        yield put(getYearsResponse(action.page, [], action.isRegion))
    }
}

function* getCalculations(action) {
    try {
        const state = yield select()
        const { indexed } = state.settings
        let url = `${SERVER_APP}/${API}`
        if (action.year) url += `?year=${action.year}`
        if (action.city) url += `?city=${action.city}`
        if (action.region) url += `?region=${action.region}`
        url += `&is_region=${action.isRegion}&indexed=${indexed}`
        if (!action.isRegion) url += `&include_ci=${true}`
        const response = yield fetch(url).then((res) => res.json())
        yield put(getCalculationsResponse(action.page, response?.calculations ?? []))
    } catch (error) {
        yield put(getCalculationsResponse(action.page, []))
    }
}

function* getCIInfo(action) {
    try {
        const state = yield select()
        const { indexed } = state.settings
        const url = `${SERVER_APP}/${API}/ci?city=${action.city}&indexed=${indexed}`
        const response = yield fetch(url).then((res) => res.json())
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
        const url = `${SERVER_APP}/${API}/map?year=${action.year}&is_region=${isRegion}&include_ci=${action.includeCI}&indexed=${indexed}`
        const response = yield fetch(url).then((res) => res.json())
        yield put(getCalculationsOnMapResponse(action.page, response?.calculations ?? []))
    } catch (error) {
        yield put(getCalculationsOnMapResponse([]))
    }
}

function* getCalculationsForChart(action) {
    try {
        const state = yield select()
        const { indexed } = state.settings
        let url = `${SERVER_APP}/${API}/chart?parameter=${action.parameters}&indexed=${indexed}`
        if (action.isMultiParams)
            url = `${SERVER_APP}/${API}/chart?parameters=${action.parameters.join()}&indexed=${indexed}&is_multi_params=true&city${
                action.city
            }`
        const response =
            action.parameters.length > 0 ? yield fetch(url).then((res) => res.json()) : undefined
        yield put(getCalculationsForChartResponse(response?.calculations ?? []))
    } catch (error) {
        yield put(getCalculationsForChartResponse([]))
    }
}

function* getCICategories() {
    // eslint-disable-next-line camelcase
    const { ci_categories } = yield fetch(`${SERVER_APP}/${API}/categories`).then((res) =>
        res.json()
    )
    yield put(getCICategoriesResponse(ci_categories))
}

export default function* calculationsSaga() {
    yield all([
        takeLatest(GET_CITIES, getCities),
        takeLatest(GET_REGIONS, getRegions),
        takeEvery(GET_YEARS, getYears),
        takeLatest(GET_CALCULATIONS, getCalculations),
        takeLatest(GET_CI_INFO, getCIInfo),
        takeLatest(GET_CALCULATIONS_ON_MAP, getCalculationsOnMap),
        takeLatest(GET_CALCULATIONS_FOR_CHART, getCalculationsForChart),
        takeLatest(GET_CI_CATEGORIES, getCICategories),
    ])
}
