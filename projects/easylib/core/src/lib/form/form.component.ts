import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoggableComponent } from 'src/app/core/log/loggable.component';
import { RouterService } from 'src/app/core/router/router.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends LoggableComponent {

  @Input() logs = true;
  @Input() title: string;
  @Input() form: FormGroup;
  @Input() errorMessage: string;
  @Input() showBack: boolean = false;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  constructor(public router: RouterService) {
    super();
  }

  public submit(): void {
    this.log('FormComponent.submit()');
    this.onSubmit.emit();
  }

  // public back(): void {
  //   this.log('FormComponent.back()');
  //   this.router.back();
  // }

}
