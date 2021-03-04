import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRegistrationService } from 'src/app/features/user/user-registration.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';
import { sameFields } from '../../features/form/validators/same-fields.validator';

@Component({
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
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
    ])
  ]
})
export class RegistrationComponent {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  usernamePattern = /^[a-z0-9_\-]{3,100}$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+).{8,20}$/;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userRegistrationService: UserRegistrationService,
    private userSignInService: UserSignInService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: [sameFields('password', 'confirmPassword')] });
  }

  onSubmit(): void {
    this.userRegistrationService.register(this.form.value)
      .pipe(
        catchError(response => {
          if (response.status === 409) {
            this.toastr.error('REGISTRATION.TOASTS.CONFLICT', undefined, { closeButton: true, disableTimeOut: true });
          } else {
            this.toastr.error('REGISTRATION.TOASTS.UNKNOWN', undefined, { closeButton: true, disableTimeOut: true });
          }
          console.error(response);
          return of(false);
        })
      ).subscribe(response => {
        if (response && response.status === 201) {
          this.toastr.success('REGISTRATION.TOASTS.SUCCESS', undefined, { closeButton: true, disableTimeOut: true });
          this.userSignInService.signIn({
            username: this.form.value.username,
            password: this.form.value.password
          }).subscribe(signedIn => {
            const redirect = this.activatedRoute.snapshot.queryParams.redirect || undefined;
            if (signedIn && redirect) {
              this.router.navigateByUrl(redirect, { replaceUrl: true });
            }
          });
        }
      });
  }

  get username(): FormControl {
    return this.form.controls.username as FormControl;
  }

  get email(): FormControl {
    return this.form.controls.email as FormControl;
  }

  get password(): FormControl {
    return this.form.controls.password as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.controls.confirmPassword as FormControl;
  }

}
