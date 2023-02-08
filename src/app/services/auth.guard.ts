import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, map, take, takeUntil, takeWhile, filter } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.user.pipe(
      filter(user => user !== undefined),
      map(user => {
        if (user && !user.enable) {
          this.router.navigate(['/unauthorized-user']);
        }
        return !!user;
      }),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/signin']);
        }
      })
    );
  }
}
