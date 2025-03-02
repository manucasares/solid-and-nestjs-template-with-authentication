import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = (WrappedComponent: Component): Component => {
  return () => {
    const navigate = useNavigate();
    const { user } = useUser();

    createEffect(prev => {
      if (user() == null) {
        navigate('/sign-in', { replace: true });
      }
    });

    return user() ? <WrappedComponent /> : null;
  };
};

export default ProtectedRoute;
