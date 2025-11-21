import Router from '@koa/router'
import { login, logout } from '../controllers/AuthController'

const authRouter = new Router({
	prefix: '/auth',
})

authRouter.post('/login', login)
authRouter.post('/logout', logout)

export default authRouter