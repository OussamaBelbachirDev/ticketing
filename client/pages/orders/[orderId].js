import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/user-request';
import Router from 'next/router';

const ShowOrder = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      // const msLeft = new Date() - new Date(order.expiresAt);
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div>
      <h4>Purchasing {order.ticket.title}</h4>
      <h5>Price : {order.ticket.price} $</h5>

      {timeLeft > 0 && (
        <>
          <div className="mb-3">
            You have <strong>{timeLeft}</strong> seconds left to order
          </div>
          <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51HsALdDaaRP3hV8fuaJWkl9sFR5aXTuPicyy6FWegzLM1YzBi921J4D6h99Qf2K8QwTjZpqcOXp8jDoWvFW34uGs00e9ruKPBR"
            amount={order.ticket.price * 100}
            email={currentUser.email}
          />
          {errors}
        </>
      )}
      {timeLeft < 0 && (
        <>
          <h1>Order Expired !!!!</h1>
        </>
      )}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get('/api/orders/' + orderId);

  return { order: data };
};

export default ShowOrder;
