import { CanLoad, Route, ActivatedRoute, RouterStateSnapshot, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { LoginService } from "./login/login.service";

@Injectable()
export class LoggedInGuard implements CanLoad, CanActivate {

    constructor(private loginService: LoginService) {}

    checkAuthetication(path: string): boolean {
        const loggedIn = this.loginService.isLoggedIn()
        if(!loggedIn) {
            this.loginService.handleLogin(`/${path}`)
        }
        return loggedIn
    }
    
    canLoad(route: Route): boolean {
        console.log('canLoad')
        return this.checkAuthetication(route.path)
    }

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {
        console.log('canActivate')
        return this.checkAuthetication(activatedRoute.routeConfig.path)
    }
}