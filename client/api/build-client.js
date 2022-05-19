import axios from "axios";

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://rccsilva.com',
      headers: req?.headers
    })
  }

  return axios.create({
    baseURL: '/'
  })
}
