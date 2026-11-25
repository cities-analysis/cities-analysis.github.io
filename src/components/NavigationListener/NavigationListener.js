import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { locationChanged } from '../../redux/actions/location'

export default function NavigationListener() {
    const { path } = useSelector((state) => state.location)
    const dispatch = useDispatch()

    const location = useLocation()

    useEffect(() => {
        const newPath = location?.pathname
        if (newPath !== path?.[0])
            dispatch(locationChanged(newPath.startsWith('/') ? newPath.substring(1) : newPath))
    }, [location])

    return undefined
}
