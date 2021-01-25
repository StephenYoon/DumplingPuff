import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthUserService } from "../services/auth-user.service";

export class AuthGuard implements CanActivate , CanActivateChild {

  constructor(private authUserService: AuthUserService, private router: Router) {   }

  canActivate(route: ActivatedRouteSnapshot, state:
  RouterStateSnapshot): boolean |
  Observable<boolean> | Promise<boolean> {
    // save the id from route snapshot
    const id = +route.params.id;

    // if you try to logging with id
    if (id) {
      this.router.navigate(["/courses"]);
      return this.authUserService.login(id);
    }

    // if you already logged and just navigate between pages
    else if (this.authUserService.isLoggedIn())
       return true;

    else {
      this.router.navigate(["/page_not_found"]);
      return false;
    }
   }

    canActivateChild(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean |
    Observable<boolean> | Promise<boolean> {
       return this.canActivate(route, state);
     }

}