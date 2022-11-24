import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const { expiresAt } = order;
  const [secondsTillExpires, setSecondsTillExpires] = useState(0);

  const { doRequest, errors } = useRequest();

  useEffect(() => {
    const msTillExpires = new Date(expiresAt) - new Date();
    let secondsLeft = Math.floor(msTillExpires / 1000);
    setSecondsTillExpires(secondsLeft);

    const interval = setInterval(() => {
      if (secondsLeft <= 0) {
        clearInterval(interval);
      } else {
        secondsLeft -= 1;
        setSecondsTillExpires(secondsLeft);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const payForTicket = async (token) => {
    const response = await doRequest({
      url: '/api/payments',
      method: 'post',
      body: {
        token: token.id,
        orderId: order.id,
      },
      onSuccess: () => Router.push('/orders'),
    });
  };

  const activeOrderJsx =
    secondsTillExpires > 0 ? (
      <>
        <div>You have {secondsTillExpires} seconds left to order</div>
        <StripeCheckout
          token={payForTicket}
          stripeKey="pk_test_Cq0ZnIzPUOEYTPMI4rTfhNtM"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
      </>
    ) : (
      <div>Sorry, this order has expired</div>
    );
  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      {activeOrderJsx}
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log(data);
  return { order: data };
};

export default OrderShow;
