import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public connexion = true;
  public inscription = false;
  public loginValid = true;
  public inscValid = true;

  public username = '';
  public email = '';
  public password = '';

  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    // private _authService: AuthService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/game';
  }

  public ngOnInit(): void {
    // this._authService.isAuthenticated$.pipe(
    //   filter((isAuthenticated: boolean) => isAuthenticated),
    //   takeUntil(this._destroySub$)
    // ).subscribe( _ => this._router.navigateByUrl(this.returnUrl));
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public logIn(): void {
    this.loginValid = false; // display error message
    this.inscValid = true; // hide other message

    // this._authService.login(this.username, this.password).pipe(
    //   take(1)
    // ).subscribe({
    //   next: _ => {
    //     this.loginValid = true;
    //     this._router.navigateByUrl('/game');
    //   },
    //   error: _ => this.loginValid = false
    // });
  }

  public inscriptionUser(): void {
    this.inscValid = false; // display error message
    this.loginValid = true; // hide other message
  }

}
