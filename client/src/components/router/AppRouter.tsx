import { lazy, type Component } from 'solid-js';
import { Navigate, Route, Router } from '@solidjs/router';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const SignIn = lazy(() => import('../../pages/sign-in/SignIn'));
const SignUp = lazy(() => import('../../pages/sign-up/SignUp'));
const Home = lazy(() => import('../../pages/home/Home'));

const AppRouter: Component = () => {
  return (
    <Router>
      <Route path="/sign-in" component={PublicRoute(SignIn, { redirectIfAuthenticated: true })} />
      <Route path="/sign-up" component={PublicRoute(SignUp, { redirectIfAuthenticated: true })} />
      <Route path="/home" component={ProtectedRoute(Home)} />
      <Route path="*" component={() => <Navigate href="/home" />} />
    </Router>
  );
};

export default AppRouter;
