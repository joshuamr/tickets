import Link from 'next/link';

function LandingPage({ tickets, currentUser }) {
  if (currentUser) {
    const ticketList = tickets.map((ticket) => {
      return (
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              <a>View</a>
            </Link>
          </td>
        </tr>
      );
    });
    return (
      <div>
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr key="">
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    );
  }
  return <h1>You are not signed in.</h1>;
}

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
