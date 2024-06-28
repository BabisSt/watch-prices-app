import React from 'react';
import { Home } from '../pages/home';

export const routeMap = {
    Home: {
        id: 'home',
        path: '/',
        page: <Home />,
        breadcrumb: 'navbar.home'
    },
};
