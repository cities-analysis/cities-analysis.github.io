import * as types from '../types'
import pagesState from '../../pages/pagesState'

const INIT_DATA = { data: [], isLoading: false }

const initialState = {
    [pagesState.CHARTS_PAGE]: {
        cities: INIT_DATA,
        years: INIT_DATA,
        calculations: INIT_DATA,
    },
    [pagesState.CI_PAGE]: {
        cities: INIT_DATA,
        categories: INIT_DATA,
        ciInfo: {},
    },
    [pagesState.DATA_PAGE]: {
        cities: INIT_DATA,
        cityYears: INIT_DATA,
        regions: INIT_DATA,
        regionYears: INIT_DATA,
        calculations: INIT_DATA,
    },
    [pagesState.MAP_PAGE]: {
        cityYears: INIT_DATA,
        regionYears: INIT_DATA,
        calculations: INIT_DATA,
    },
    [pagesState.NEW_MAP_PAGE]: {
        cities: INIT_DATA,
        years: INIT_DATA,
        calculations: INIT_DATA,
    },
}

function calculationsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.GET_CITIES: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    cities: {
                        isLoading: true,
                    },
                },
            }
        }
        case types.GET_CITIES_RESPONSE: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    cities: {
                        data: action.cities,
                        isLoading: false,
                    },
                },
            }
        }
        case types.GET_REGIONS: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    regions: {
                        isLoading: true,
                    },
                },
            }
        }
        case types.GET_REGIONS_RESPONSE: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    regions: {
                        data: action.regions,
                        isLoading: false,
                    },
                },
            }
        }
        case types.GET_YEARS: {
            const newState = {}
            if (state[action.page].years !== undefined)
                newState.years = { ...state[action.page].years, isLoading: true }
            else if (action.isRegion)
                newState.regionYears = { ...state[action.page].regionYears, isLoading: true }
            else newState.cityYears = { ...state[action.page].cityYears, isLoading: true }
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    ...newState,
                },
            }
        }
        case types.GET_YEARS_RESPONSE: {
            const newState = {}
            if (state[action.page].years !== undefined)
                newState.years = {
                    ...state[action.page].years,
                    data: action.years,
                    isLoading: false,
                }
            else if (action.isRegion)
                newState.regionYears = {
                    ...state[action.page].regionYears,
                    data: action.years,
                    isLoading: false,
                }
            else
                newState.cityYears = {
                    ...state[action.page].cityYears,
                    data: action.years,
                    isLoading: false,
                }
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    ...newState,
                },
            }
        }
        case types.GET_CALCULATIONS:
        case types.GET_CALCULATIONS_FOR_CHART:
        case types.GET_CALCULATIONS_ON_MAP: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    calculations: {
                        data: [],
                        isLoading: true,
                    },
                },
            }
        }
        case types.GET_CALCULATIONS_RESPONSE:
        case types.GET_CALCULATIONS_FOR_CHART_RESPONSE:
        case types.GET_CALCULATIONS_ON_MAP_RESPONSE: {
            return {
                ...state,
                [action.page]: {
                    ...state[action.page],
                    calculations: {
                        data: action.calculations,
                        isLoading: false,
                    },
                },
            }
        }
        case types.GET_CI_INFO: {
            return {
                ...state,
                [pagesState.CI_PAGE]: {
                    ...state[pagesState.CI_PAGE],
                    ciInfo: {
                        data: undefined,
                        isLoading: true,
                    },
                },
            }
        }
        case types.GET_CI_INFO_RESPONSE: {
            return {
                ...state,
                [pagesState.CI_PAGE]: {
                    ...state[pagesState.CI_PAGE],
                    ciInfo: {
                        data: action.CIInfo,
                        isLoading: false,
                    },
                },
            }
        }
        case types.GET_CI_CATEGORIES: {
            return {
                ...state,
                [pagesState.CI_PAGE]: {
                    ...state[pagesState.CI_PAGE],
                    categories: {
                        ...state[pagesState.CI_PAGE].categories,
                        isLoading: true,
                    },
                },
            }
        }
        case types.GET_CI_CATEGORIES_RESPONSE: {
            return {
                ...state,
                [pagesState.CI_PAGE]: {
                    ...state[pagesState.CI_PAGE],
                    categories: {
                        data: action.categories,
                        isLoading: false,
                    },
                },
            }
        }
        default: {
            return state
        }
    }
}

export default calculationsReducer
