import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { map, publish, takeUntil, tap } from 'rxjs/operators';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms 330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ]),
  ]
})
export class SignInComponent {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form: FormGroup;
  displayLoader = false;

  constructor(
    private fb: FormBuilder,
    private userSignInService: UserSignInService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username(): FormControl {
    return this.form.controls.username as FormControl;
  }

  get password(): FormControl {
    return this.form.controls.password as FormControl;
  }

  onSubmit(): void {
    const redirect = this.activatedRoute.snapshot.queryParams.redirect || undefined;
    const login$ = this.userSignInService.signIn(this.form.value).pipe(
      map(signedIn => {
        if (signedIn && redirect) {
          this.router.navigateByUrl(redirect, { replaceUrl: true });
        }
      })
    );
    publish()(interval(500).pipe(tap(() => this.displayLoader = true), takeUntil(login$))).connect();
  }

}
