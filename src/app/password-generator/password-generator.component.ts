import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StringOptions } from '../../models/stringOptions';

@Component({
    selector: 'app-password-generator',
    standalone: true,
    templateUrl: './password-generator.component.html',
    styleUrl: './password-generator.component.css',
    imports: [ReactiveFormsModule,CommonModule]
})
export class PasswordGeneratorComponent implements OnInit{

  form!: FormGroup;

  constructor(
    private readonly _formBuilder:FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      length: new FormControl(0, [Validators.required, Validators.min(3), Validators.max(20)]),
      uppercase: new FormControl(true),
      lowercase: new FormControl(true),
      numbers: new FormControl(true),
      symbols: new FormControl(true),
      password: new FormControl('')
    })
  }

  onSubmit() {
    if (this.form.valid) {
        const data = this.form.getRawValue();
        const { length, lowercase, uppercase, numbers, symbols } = data;
        this.form.get('password')?.setValue(this.generateRandomString(length, { lowercase, uppercase, numbers, symbols }));
    }
  }


generateRandomString(length:number, options:StringOptions ={numbers:true,lowercase:true, uppercase:true, symbols:true}):string{
    let charSet = "";
    if (options.numbers) {
      charSet += "01234567890123456789";
    }
    if (options.uppercase) {
      charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (options.lowercase) {
      charSet += "abcdefghijklmnopqrstuvwxyz";
    }
    if (options.symbols) {
      charSet += "!@#$%^&*()_+-=[]{};':\"\\|,<.>/?~";
    }
    if (!charSet.length) {
      return 'Please Select At least One'
    }

    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    return array.reduce((password, byte) => {
      const charIndex = byte % charSet.length;
      return password + charSet[charIndex];
    }, "");
}

copyPassword() {
  const passwordControl = this.form.get('password');
  if (passwordControl) {
      navigator.clipboard.writeText(passwordControl.value);
  }
}
}
