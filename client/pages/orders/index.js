const Orders = ({ orders }) => {
  console.log('orders ', orders);
  return (
    <div>
      <h1 className="mx-5">Orders</h1>

      <div>
        {orders.map((order) => (
          <div>
            {order.ticket.title} ----- {order.status} ----- {order.ticket.price}{' '}
            $
          </div>
        ))}
      </div>
    </div>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default Orders;
