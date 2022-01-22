# FormManager

Create and manage angular form.

## How to use: example

Import form modules in your module:
### register.module.ts
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CardModule } from '@easylib/material';
import { InputModule } from '@easylib/material';
import { ButtonModule } from '@easylib/material';
import { RegisterComponent } from './register.component';
@NgModule({
  declarations: [
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CardModule,
    InputModule,
    ButtonModule,
  ],
})
export class RegisterModule { }
```

Extends `FormManagerComponent` in your component and set `formStructure`.
If you implements `OnInit` and/or `OnDestroy` you must call `super.ngOnInit()`
and `super.ngOnDestroy()`.
```ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormManagerComponent } from '@easylib/core';
import { FormStructure } from '@easylib/core';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class RegisterComponent extends FormManagerComponent implements OnInit, OnDestroy {
  @Input() logs = true;
  protected formStructure: FormStructure = {
    email: {
      type: 'string',
      required: true, // Validators.required
      // email: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    samepassword: {
      type: 'string',
      required: true,
    },
  };
  ngOnInit() {
    this.log('RegisterComponent.ngOnInit()');
    super.ngOnInit();
  }
  ngOnDestroy(): void {
    this.log('RegisterComponent.ngOnDestroy()');
    super.ngOnDestroy();
  }
  submit() {
    this.log('RegisterComponent.submit() formData:', this.formData);
    // Execute register
  }
  protected onFormDataChanged(formData: any, oldFormData: any): void {
    this.log('RegisterComponent.onFormDataChanged() formData:', formData, 'oldFormData:', oldFormData);
  }
  checkSamePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.formData.password !== control.value) {
        return { notSamePassword: true };
      }
      return null;
    };
  }
  getErrorMessage(formControl: AbstractControl): string {
    const errors = formControl.errors;
    if (errors) {
      if (errors.required) {
        return 'you must enter a value';
      }
      if (errors.email) {
        return 'not a valid email';
      }
      if (errors.requiredTrue) {
        return 'must be selected';
      }
      if (errors.minLength) {
        return 'too short';
      }
      if (errors.maxLength) {
        return 'too long';
      }
      if (errors.pattern) {
        return 'password too easy';
      }
      if (errors.notSamePassword) {
        return 'passwords differs';
      }
    }
    return '';
  }
}
```

Add form components in your html component:
### app.component.html
```html
<div class="container" fxLayout="row" fxLayoutAlign="space-around center">
  <easy-card title="New account" [actions]="true">

    <p>Already have an account? <a routerLink="/login">Sign in</a></p>

    <form
    [formGroup]="form!"
    (ngSubmit)="submit()">

      <easy-input
      [form]="form!"
      controlName="email"
      label="Email"
      placeholder="email"
      [errorMessage]="getErrorMessage"
      ></easy-input>

      <easy-input
      [form]="form!"
      controlName="password"
      [password]="true"
      label="Password"
      placeholder="password"
      [errorMessage]="getErrorMessage"
      ></easy-input>

      <easy-input
      [form]="form!"
      controlName="samepassword"
      [password]="true"
      label="Retype password"
      placeholder="password"
      [errorMessage]="getErrorMessage"
      ></easy-input>

    </form>

    <easy-button
    label="Register"
    [disabled]="!this.form?.valid"
    (press)="submit()"
    ></easy-button>
  </easy-card>
</div>
```

And css:
### app.component.scss
```scss
:host {
  overflow: auto;
}
.container {
  min-height: 100%;
}
.register-card {
  max-width: 400px;
  margin: 20px;
}
.logo {
  background-image: url('/assets/logo.png');
  background-size: cover;
}
.mat-card-header-text {
  background-color: #CC66AA;
}
```