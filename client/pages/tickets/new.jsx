import { useRouter } from 'next/router'
import { useState } from "react"
import useRequest from '../../hooks/use-request'


const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price,
    },
    onSuccess: () => router.push('/')
  })

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <div>
      <h1>Create a Ticket!</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id='price'
            type="price"
            className="form-control"
            value={price}
            onBlur={onBlur}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
