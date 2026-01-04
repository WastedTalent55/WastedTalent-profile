import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { WorkComponent } from './pages/work/work.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },   // 👈 HOME
    { path: 'about', component: AboutComponent },
    { path: 'work', component: WorkComponent },
    { path: 'contact', component: ContactComponent },    
];
