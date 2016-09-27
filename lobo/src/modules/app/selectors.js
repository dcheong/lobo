import { NAME } from './constants'

export const branch = (state) => state[NAME]
export const isPinging = (state) => branch(state).isPinging
