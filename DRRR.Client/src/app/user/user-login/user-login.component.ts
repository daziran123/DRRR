import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SystemMessagesService } from '../../core/system-messages.service'
import { FormErrorsAutoClearerService } from '../../core/form-errors-auto-clearer.service'
import { UserLoginService } from './user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;

  formErrorMessages: object;

  private validationMessages: object;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msgService: SystemMessagesService,
    private loginService: UserLoginService,
    private autoClearer: FormErrorsAutoClearerService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.formErrorMessages = {};
    // 为避免获取消息时配置文件尚未加载，在外面多包一层函数
    this.validationMessages = {
      username: () => this.msgService.getMessage('E001', '用户名'),
      password: () => this.msgService.getMessage('E001', '密码')
    };
    autoClearer.register(this.loginForm, this.formErrorMessages);
  }

  onLogin(data: object) {
    if (!this.loginForm.valid) {
      for (const controlName in this.loginForm.controls) {
        if (!this.loginForm.controls[controlName].valid) {
          this.formErrorMessages[controlName] = this.validationMessages[controlName]();
        }
      }
    } else if (!this.formErrorMessages['username']) {
      this.loginService
        .login(data)
        .subscribe(res => {
          if (res.error) {
            // 在用户名输入框下方显示错误信息
            this.formErrorMessages['username'] = res.error;
          }else {
          }
      });
    }
  }
}