import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import Home from '../pages/Home';
import LocationDetails from '../pages/LocationDetails';
import AcervoDigital from '../pages/AcervoDigital';
import ColaboreConosco from '../pages/ColaboreConosco';
import Auth from '../pages/Auth';
import Users from '../pages/admin/Users';
import Indicators from '../pages/admin/Indicators';
import Collection from '../pages/admin/Collection';
import Gallery from '../pages/admin/Gallery';
import GalleryItems from '../pages/admin/GalleryItems';
import Galleries from '../pages/Galleries';
import TwinCities from '../pages/admin/TwinCities';
import Collaboration from '../pages/admin/Collaboration';
import ProtectedRoute from '../components/ProtectedRoute';
import AccessDenied from '../pages/AccessDenied';

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
        path: 'user',
        element: <Users />
      },
      {
        path: 'galerias',
        element: <Galleries />
      },
      {
        path: 'acesso-negado',
        element: <AccessDenied />
      }
    ]
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TwinCities />
      },
      {
        path: 'twin-cities',
        element: <TwinCities />
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
      },
      {
        path: 'collaboration',
        element: <Collaboration />
      }
    ]
  }
]);