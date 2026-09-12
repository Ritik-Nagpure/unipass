import { setCookie, deleteCookie } from './cookies'

// On successful login:
setCookie('isLogin', 'true')
window.location.href = '/'   // or use router.navigate({ to: '/' })

// On logout:
deleteCookie('isLogin')
window.location.href = '/auth'