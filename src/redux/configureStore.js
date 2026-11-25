import logger from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import { persistReducer, persistStore } from 'redux-persist'
import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import locationReducer from './reducers/location'
import calculationsReducer from './reducers/calculations'
import settingsReducer from './reducers/settings'
import rootSaga from '../sagas'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['location', 'calculations', 'settings'],
}

const reducers = combineReducers({
    location: locationReducer,
    calculations: calculationsReducer,
    settings: settingsReducer,
})

function configureStore() {
    const middleware = []
    const enhancers = []
    const sagaMiddleware = createSagaMiddleware()
    middleware.push(sagaMiddleware)
    if (process.env.NODE_ENV === 'development') middleware.push(logger)
    enhancers.push(applyMiddleware(...middleware))

    const persistedReducer = persistReducer(persistConfig, reducers)
    const store = createStore(persistedReducer, compose(...enhancers))
    const persistor = persistStore(store)

    sagaMiddleware.run(rootSaga)

    return { store, persistor }
}

export default () => configureStore()
