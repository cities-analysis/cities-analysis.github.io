import * as types from '../types'

export function switchIsRegion(isRegion) {
    return {
        type: types.SWITCH_IS_REGION,
        isRegion,
    }
}

export function switchIndexed(indexed) {
    return {
        type: types.SWITCH_INDEXED,
        indexed,
    }
}

export function switchCiVersion(ciVersion) {
    return {
        type: types.SWITCH_CI_VERSION,
        ciVersion,
    }
}
