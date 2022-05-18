import { useRouter } from "next/router"
import { useState } from "react"
import useRequest from "../../hooks/use-request"


export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password
    }
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    const response = await doRequest()

    if (response) {
      router.push('/')
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Signup</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-control"
          type='password'
        />
      </div>
      {errors}
      <button className="btn btn-primary">Signin</button>
    </form>
  )
}
