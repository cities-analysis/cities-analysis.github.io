import { all } from 'redux-saga/effects'
import calculationsSaga from './CalculationsSaga'

export default function* root() {
    yield all([calculationsSaga()])
}
