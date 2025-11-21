import {User} from '../models/users'
import InMemoryDB from './InMemoryDB'

export default class UserRepository extends InMemoryDB<User> {
    constructor() {
        super()
    }
}