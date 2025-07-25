import { useEffect, useState } from 'react';

type Order = {
  type: 'cappuccino' | 'espresso' | 'latte' | 'mocha';
  price: number;
  quantity: number;
};

function App() {
  const [orders, setOrders] = useState<Order[]>([]);

  const total = orders.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0
  );

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.type}>{order.type}</li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
}
