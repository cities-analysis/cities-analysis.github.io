export default class NavigationUtils {
    static getPath() {
        const path = window.location.pathname
        return path.startsWith('/') ? path.substring(1).split('/') : path.split('/')
    }
}
