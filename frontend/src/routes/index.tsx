import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import Home from '../pages/Home';
import LocationDetails from '../pages/LocationDetails';
import AcervoDigital from '../pages/AcervoDigital';
import ColaboreConosco from '../pages/ColaboreConosco';
import Auth from '../pages/Auth';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Locations from '../pages/admin/Locations';
import Indicators from '../pages/admin/Indicators';
import Collection from '../pages/admin/Collection';
import Gallery from '../pages/admin/Gallery';
import GalleryItems from '../pages/admin/GalleryItems';
import Galleries from '../pages/Galleries';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'acervo',
        element: <AcervoDigital />
      },
      {
        path: 'colabore',
        element: <ColaboreConosco />
      },
      {
        path: 'galeria',
        element: <Galleries />
      },
      {
        path: 'location/:id',
        element: <LocationDetails />
      },
      {
        path: 'auth',
        element: <Auth />
      },
      {
        path: 'user',
        element: <Users />
      },
      {
        path: 'galerias',
        element: <Galleries />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'locations',
        element: <Locations />
      },
      {
        path: 'indicators',
        element: <Indicators />
      },
      {
        path: 'collection',
        element: <Collection />
      },
      {
        path: 'gallery',
        element: <Gallery />
      },
      {
        path: 'gallery/:id/items',
        element: <GalleryItems />
      }
    ]
  }
]);