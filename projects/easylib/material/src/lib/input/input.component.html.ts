export default `
<mat-form-field
appearance="legacy"
floatLabel="always"
[class.mat-form-field-readonly]="readonly"
>
  <mat-label>{{label}}</mat-label>

  <input
  matInput
  [type]="(password && hide) ? 'password' : (type ? type : 'text')"
  [placeholder]="placeholder!"
  [formControlName]="controlName"
  [required]="formControl?.errors?.required"
  [readonly]="readonly"
  >

  <button
  *ngIf="password"
  mat-icon-button
  matSuffix
  (click)="hide = !hide"
  [attr.aria-label]="'Hide password'"
  [attr.aria-pressed]="hide">
    <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
  </button>
  <mat-hint>{{hint}}</mat-hint>
  <mat-error *ngIf="formControl?.invalid">{{getErrorMessage()}}</mat-error>
</mat-form-field>
`;
