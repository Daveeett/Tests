import { Routes } from '@angular/router';
import path from 'path';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { Component, viewChildren, ViewChildren } from '@angular/core';
import { LogsUsers } from './pages/logs-users/logs-users';

export const routes: Routes = [

    { path: '', component: LoginDeveloper },
    {path:'logs-users', component:LogsUsers},
    
];
