import { useEffect, useState } from 'react';

function App() {
  const [coffee, setCoffee] = useState({
    type: 'cappuccino',
    size: 'medium',
    sugar: 0,
    milk: false,
  });

  const handleCoffeeTypeChange = (
    type: 'cappuccino' | 'espresso' | 'latte' | 'mocha'
  ) => {
    setCoffee((prev) => ({
      ...prev,
      type,
    }));
  };
}

type CoffeeOrder =
  | {
      status: 'idle';
      error: null;
      receipt: null;
    }
  | {
      status: 'loading';
      error: null;
      receipt: null;
    }
  | {
      status: 'error';
      error: string;
      receipt: null;
    }
  | {
      status: 'success';
      receipt: { total: number };
    };

function App2() {
  const [receipt, setReceipt] = useState<{ total: number } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [coffeeOrder, setCoffeeOrder] = useState<CoffeeOrder>({
    status: 'idle',
    error: null,
    receipt: null,
  });

  useEffect(() => {
    setStatus('loading');
    let canceled = false;

    // mock fetch call
    fetch('https://api.coffee.com/order', {
      method: 'POST',
      body: JSON.stringify(coffeeOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!canceled) {
          setStatus('success');
          setReceipt(data);

          setCoffeeOrder({
            status: 'success',
            receipt: data,
          });
        }
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [coffeeOrder]);

  if (coffeeOrder.status === 'success') {
    return <div>Receipt: {coffeeOrder.receipt.total}</div>;
  }
}
