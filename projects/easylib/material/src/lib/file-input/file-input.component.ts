import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { LoggableComponent } from 'src/app/core/log/loggable.component';

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
 * 
 * https://malcoded.com/posts/angular-file-upload-component-with-express/
 * 
 * https://www.codeproject.com/Articles/1236006/Build-a-File-Upload-Component-with-Angular-Materia
 * https://www.youtube.com/watch?v=JmfvqZpcvRg
 * https://codingwithnotrycatch.com/2019/09/file-upload-component-con-angular-material/
 * 
 * https://stackoverflow.com/questions/40214772/file-upload-in-angular
 * https://stackoverflow.com/questions/52622061/how-to-use-input-type-file-in-angular-material/53546417#53546417
 * 
 * https://www.npmjs.com/package/angular-material-fileupload
 * 
 * https://www.npmjs.com/package/@angular-material-components/file-input
 * https://merlosy.github.io/ngx-material-file-input/
 * https://github.com/h2qutc/angular-material-components/blob/f147c1c9645167fb170bbca4aa9d91f757c2bb5a/src/app/demo-fileinput/demo-fileinput.component.ts
 * https://www.positronx.io/angular-material-file-browse-upload-ui-with-material-components/
 * 
 */
@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent extends LoggableComponent implements OnInit {

  @Input() logs = true;

  @Input() form: FormGroup;
  @Input() controlName: string;
  // private formControl: FormControl;

  // @Input() disabled: boolean;
  @Input() multiple = false;
  @Input() accept: string;
  @Input() color: ThemePalette;
  @Input() disabled: boolean;

  @Input() label: string;
  @Input() icon: string;
  @Input() img: string;

  @ViewChild('fileInput') fileInput;
  // public files: Set<File> = new Set();
  private files: Array<File> = [];

  @Output() onFileSelected: EventEmitter<File[]> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    // this.formControl = this.form.get(this.controlName);
    this.form.get(this.controlName).setValue(this.files);
  }

  public click(): void {
    this.log('FileInputComponent:click()');
  }

  onSelected(event): void {
    this.log('FileInputComponent.onFileSelected() event:', event);
    const nativeElementFiles: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.log('FileInputComponent.onFileSelected() nativeElementFiles:', nativeElementFiles);
    for (const key in nativeElementFiles) {
      this.log('FileInputComponent.onFileSelected() key:', key);
      if (!isNaN(parseInt(key, 10))) {
        this.log('FileInputComponent.onFileSelected() nativeElementFiles[key]:', nativeElementFiles[key]);
        this.files.push(nativeElementFiles[key]);
      }
    }
    this.log('FileInputComponent.onFileSelected() this.files:', this.files);
    const formValue = this.form.get(this.controlName).value;
    this.log('FileInputComponent.onFileSelected() formValue:', formValue);
    this.onFileSelected.emit(this.files);
  }
}
