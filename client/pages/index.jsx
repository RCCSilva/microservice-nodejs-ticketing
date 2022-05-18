import Link from 'next/link'

const LandingPage = ({ tickets }) => {
  const ticketList = tickets?.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }

}

// Wil be triggered in the browser on page routing
// LandingPage.getInitialProps = async ({ req }) => {
//   const { data } = await buildClient({ req }).get('/api/users/currentuser')

//   return data
// }

// Exclusive server side request solution
// export const getServerSideProps = async (ctx) => {

//   // SERVICE.SERVICE.SVC.CLUSTER.LOCAL
//   const response = await axios.get(
//     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser'
//     , {
//       headers: ctx.req.headers
//     })

//   return { props: { user: response.data } }
// }

export default LandingPage
