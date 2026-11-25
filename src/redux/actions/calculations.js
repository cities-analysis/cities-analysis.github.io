import * as types from '../types'
import pagesState from '../../pages/pagesState'

export function getCities(page) {
    return {
        type: types.GET_CITIES,
        page,
    }
}

export function getCitiesResponse(page, cities) {
    return {
        type: types.GET_CITIES_RESPONSE,
        page,
        cities,
    }
}

export function getRegions(page) {
    return {
        type: types.GET_REGIONS,
        page,
    }
}

export function getRegionsResponse(page, regions) {
    return {
        type: types.GET_REGIONS_RESPONSE,
        page,
        regions,
    }
}

export function getYears(page, isRegion) {
    return {
        type: types.GET_YEARS,
        page,
        isRegion,
    }
}

export function getYearsResponse(page, years, isRegion) {
    return {
        type: types.GET_YEARS_RESPONSE,
        page,
        years,
        isRegion,
    }
}

export function getCalculations(year, city, region, page, isRegion) {
    return {
        type: types.GET_CALCULATIONS,
        year,
        city,
        region,
        page,
        isRegion,
    }
}

export function getCalculationsResponse(page, calculations) {
    return {
        type: types.GET_CALCULATIONS_RESPONSE,
        page,
        calculations,
    }
}

export function getCIInfo(city) {
    return {
        type: types.GET_CI_INFO,
        city,
    }
}

export function getCIInfoResponse(CIInfo) {
    return {
        type: types.GET_CI_INFO_RESPONSE,
        CIInfo,
    }
}

export function getCalculationsOnMap(year, page, includeCI) {
    return {
        type: types.GET_CALCULATIONS_ON_MAP,
        year,
        page,
        includeCI,
    }
}

export function getCalculationsOnMapResponse(page, calculations) {
    return {
        type: types.GET_CALCULATIONS_ON_MAP_RESPONSE,
        page,
        calculations,
    }
}

export function getCalculationsForChart(parameters, isMultiParams = false, city = undefined) {
    return {
        type: types.GET_CALCULATIONS_FOR_CHART,
        page: pagesState.CHARTS_PAGE,
        parameters,
        isMultiParams,
        city,
    }
}

export function getCalculationsForChartResponse(calculations) {
    return {
        type: types.GET_CALCULATIONS_FOR_CHART_RESPONSE,
        page: pagesState.CHARTS_PAGE,
        calculations,
    }
}

export function getCICategories() {
    return {
        type: types.GET_CI_CATEGORIES,
    }
}

export function getCICategoriesResponse(categories) {
    return {
        type: types.GET_CI_CATEGORIES_RESPONSE,
        categories,
    }
}
