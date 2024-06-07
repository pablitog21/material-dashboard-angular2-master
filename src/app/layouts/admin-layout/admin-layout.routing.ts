import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // },
    { path: 'dashboard',      component: DashboardComponent },
];
