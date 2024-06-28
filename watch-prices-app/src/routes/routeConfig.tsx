import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../pages/layout';
import { routeMap } from './routeMap';

const Routing = () => {
    return (
        <Routes>
            {/* Protected routes first, as defined in routeMap object */}
            {Object.keys(routeMap).map((route) => {
                return (
                    <Route
                        key={'route-' + route}
                        path={routeMap[route].path}
                        element={
                            routeMap[route].page
                        }
                    />
                );
            })}

            {/* <Route path="*" element={<Page404 />} /> */}

        </Routes>
    );
};

export { Routing };
