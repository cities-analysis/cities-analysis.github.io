import * as types from '../types'

export function locationChanged(newLocation) {
    return {
        type: types.LOCATION_CHANGED,
        newLocation,
    }
}
