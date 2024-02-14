import { useEffect } from 'react';
import useRequest from '../../hooks/user-request';
import Router from 'next/router';

const SignOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    body: {},
    method: 'post',
    onSuccess: () => Router.push('/'),
  });
  useEffect(() => {
    doRequest();
    console.log('ok');
  });
  return null;
};

export default SignOut;
