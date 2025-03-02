import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { useUser } from '../../context/UserContext';

interface PublicRouteOptions {
  redirectIfAuthenticated?: boolean;
}

const PublicRoute = (WrappedComponent: Component, options: PublicRouteOptions): Component => {
  return () => {
    const { redirectIfAuthenticated } = options || {};

    const navigate = useNavigate();
    const { user } = useUser();

    createEffect(() => {
      if (user() && redirectIfAuthenticated) {
        navigate('/home', { replace: true });
      }
    });

    return <WrappedComponent />;
  };
};

export default PublicRoute;
