import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
  })

  useEffect(() => {
    ;(async () => {
      const response = await doRequest()

      if (response) {
        router.push('/')
      }
    })()
  }, [])

  return null
}
