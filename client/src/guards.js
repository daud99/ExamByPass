import {store} from './store/store'
import Vue from 'vue';
import {quickRequest} from "../common/misc";

export default {

    isAdmin(to, from, next) {
        
        if (localStorage.getItem('roles') === "admin") {
            next()
        } else {
            next({
                path: "/dashboard"
            });
        }
    },
    
    isUserOrAdmin(to, from, next) {
        const type = localStorage.getItem('roles')
        if ((type === 'admin' || type === 'user')) {
            next()
        } else {
            next({
                path: "/login"
            });
        }
    },

    isNotAuthenticated(to, from, next) {
        if(!localStorage.getItem('email')) {
            next()
        } else {
            next({
                path: "/dashboard"
            });
        }
    } 

}