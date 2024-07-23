import React from 'react';
import Home from '../pages/home';
import WatchDetail from '../components/WatchDetail';

export const routeMap = {
    Home: {
        id: 'home',
        path: '/',
        component: Home,
        breadcrumb: 'navbar.home',
    },
    WatchDetail: {
        id: 'watch-detail',
        path: '/watch/:watchId', // Define the route parameter
        component: WatchDetail as React.FC<WatchDetailProps>, // Cast WatchDetail as React.FC<WatchDetailProps>
        breadcrumb: 'navbar.watchDetail',
    },
};
