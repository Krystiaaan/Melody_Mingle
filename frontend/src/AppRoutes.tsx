// import { Route, Routes } from 'react-router'
// import { BrowserRouter as Router } from 'react-router-dom'
import { Navigate, Route, RouteProps, Routes, useLocation } from "react-router-dom";
// import { LandingPage } from './pages/landingPage/LandingPage.tsx'
import { LoginPage } from "./pages/loginPage/LoginPage.tsx";
import { RegisterPage } from "./pages/registerPage/RegisterPage.tsx";
import { ProfilePage } from "./pages/profilePage/ProfilePage.tsx";
// import { Navbar } from './pages/generalComponents/Navbar.tsx'
import { useAuth } from "./providers/AuthProvider.tsx";
import { LandingPage } from "./pages/landingPage/LandingPage.tsx";
import { MainPage } from "./pages/mainPage/MainPage.tsx";
import { SpotifyRedirect } from "./pages/generalComponents/SpotifyRedirect.tsx";
import { EventPage } from "./pages/eventPage/EventPage.tsx";
import { ShowEvents } from "./pages/eventPage/components/ShowEvents.tsx";
import { IssuePage } from "./pages/issuePage/IssuePage.tsx";
import { TaCPage } from "./pages/TaCPage/TaCPage.tsx";

export type RouteConfig = RouteProps & {
  /**
   * Required route path.   * E.g. /home   */
  path: string;
  /**
   * Specify a private route if the route
   should only be accessible for authenticated users   */
  isPrivate?: boolean;
};

const routes: RouteConfig[] = [
  {
    isPrivate: false,
    path: "/",
    //element: <Navigate to="/login" replace />,
    element: <LandingPage />,
    index: true,
  },
  {
    isPrivate: true,
    path: "/melodymingle",
    element: <MainPage />,
  },
  {
    isPrivate: false,
    path: "/login",
    element: <LoginPage />,
  },
  {
    isPrivate: false,
    path: "/register",
    element: <RegisterPage />,
  },
  {
    isPrivate: true,
    path: "/profile",
    element: <ProfilePage />,
  },
    {
    path: "/events/:eventId",
    element: <EventPage />,
    isPrivate: true,
  },
  {
    isPrivate: false,
    path: "/spotify-redirect",
    element: <SpotifyRedirect />,
  },
  {
    isPrivate: false,
    path: "/show-events",
    element: <ShowEvents />,
  },
  {
    isPrivate: false,
    path: "/issue",
    element: <IssuePage />,
  },
  {
    isPrivate: false,
    path: "/toc",
    element: <TaCPage />,
  }
];

export interface AuthRequiredProps {
  to?: string;
  children?: React.ReactNode;
}

export const AuthRequired: React.FC<AuthRequiredProps> = ({ children, to = "/login" }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user && pathname !== to) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
};

const renderRouteMap = (route: RouteConfig) => {
  const { isPrivate, element, ...rest } = route;
  const authRequiredElement = isPrivate ? <AuthRequired>{element}</AuthRequired> : element;
  return <Route key={route.path} element={authRequiredElement} {...rest} />;
};

export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>;
};
