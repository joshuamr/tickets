import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest();
  const purchaseTicket = async () => {
    await doRequest({
      url: '/api/orders',
      method: 'post',
      body: { ticketId: ticket.id },
      onSuccess: (order) =>
        Router.push('/orders/[orderId]', `/orders/${order.id}`),
    });
  };
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price - {ticket.price}</h4>
      {errors}

      <button className="btn btn-primary" onClick={purchaseTicket}>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, clientUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  console.log(data);
  return { ticket: data };
};

export default TicketShow;
