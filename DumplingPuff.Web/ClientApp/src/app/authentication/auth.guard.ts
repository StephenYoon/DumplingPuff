import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CustomAuthService } from "../services/custom-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanActivateChild {

  constructor(
    private customAuthService: CustomAuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    // save the id from route snapshot
    //const id = +route.params.id;
    if (this.customAuthService.isLoggedIn()) {
       return true;
    }
    else {
      alert("Please log in first, thanks!");
      this.router.navigate(['home']);
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}