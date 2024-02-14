import Link from 'next/link';
const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map((t) => (
    <tr key={t.id}>
      <td>{t.title}</td>
      <td>{t.price}</td>
      <td>
        <Link href={'/tickets/[ticketId]'} as={'/tickets/' + t.id}>
          View
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </div>
  );
};

// Executed On The Server
LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets');
  console.log(data);
  return { tickets: data };
};

export default LandingPage;
