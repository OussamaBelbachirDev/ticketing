import { useState } from 'react';
import useRequest from '../../hooks/user-request';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('concert RMA');
  const [price, setPrice] = useState(500);

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group my-4">
          <label>Password</label>
          <input
            value={price}
            onBlur={onBlur}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
