import { Routes } from '@angular/router';
import path from 'path';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { viewChildren, ViewChildren } from '@angular/core';

export const routes: Routes = [

    { path: '', component: LoginDeveloper }
    
];
