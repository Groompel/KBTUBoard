import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  codeTimeValidator,
  firstLetterValidator,
  lastLetterValidator,
  maxLengthValidator,
  minLengthValidator,
  passwordRepeatValidator,
  regExpValidator,
  uniqueUsernameValidator,
} from '../_shared/auth-validators';
import {first} from 'rxjs/operators';
import {User} from '../_models/user';

declare const $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, AfterViewInit {
  // Jquery variables
  loginTab;
  registerTab;

  // This is required for tab changing
  currentTab = {
    name: '',
    buttonName: '',
  };

  // Link to telegram bot (may be moved to environment.ts)
  telegramBotLink = 'https://t.me/thugboikz';

  // Link to redirect to
  returnUrl = '/';

  // Telegram code from API
  codeResponse = {
    code: '',
    expirationDate: new Date(),
  };

  // Telegram response from the API
  telegramResponse = {
    message: 'Подождите...',
    valid: false,
    showResponse: false,
  };

  // To show icons
  isLoading = {
    form: false,
    telegram: false,
  };

  // To show the loading of telegram request
  codeTimerMessage = '';

  // Error message if API request fails
  authResponse = {
    showErrorResponse: false,
    errorMessage: '',
  };

  formControlCenter = {
    name: {
      checkMinLength: false,
      minLengthValidator: [minLengthValidator(1, 'Имя не может быть пустым.')],
      validators: [
        maxLengthValidator(30, 'Длина имени не должна превышать 30 символов.'),
        regExpValidator(
          /[^a-zA-Zа-яА-Я\s]/,
          'Имя должно содержать только буквы и пробелы.'
        ),
      ],
    },
    username: {
      checkMinLength: false,
      minLengthValidator: [
        minLengthValidator(
          3,
          'Длина имени пользователя не должна быть меньше 3 символов.'
        ),
      ],
      validators: [
        maxLengthValidator(
          20,
          'Длина имени пользователя не должна превышать 20 символов.'
        ),
        firstLetterValidator(
          /[\W_]+/,
          'Имя должно начинаться только на латинскую букву.'
        ),
        lastLetterValidator(
          /[\W_]+/,
          'Имя должно заканчиваться только на латинскую букву или цифру.'
        ),
        uniqueUsernameValidator(this.apiService),
        regExpValidator(
          /[\W^.]/,
          'Имя должно содержать только латинские буквы, цифры а так же нижнее подчеркивание (_).'
        ),
      ],
    },
    password: {
      checkMinLength: false,
      minLengthValidator: [
        minLengthValidator(6, 'Минимальная длина пароля - 6 символов.', false),
      ],
      validators: [
        maxLengthValidator(
          40,
          'Максимальная длина пароля - 40 символов.',
          false
        ),
      ],
    },
  };

  user = new FormGroup(
    {
      name: new FormControl('', this.formControlCenter.name.validators),
      username: new FormControl('', this.formControlCenter.username.validators),
      password: new FormControl('', this.formControlCenter.password.validators),
      passwordRepeat: new FormControl(''),
      telegramId: new FormControl('', [
        codeTimeValidator(this.codeResponse.expirationDate),
      ]),
    },
    {validators: passwordRepeatValidator}
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Telegram code timer
    setInterval(() => {
      if (!(this.codeResponse.code === '' && this.telegramId.invalid)) {
        this.codeTimer();
      }
    }, 1000);
    if (authService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  // Getters for FormControls
  get name() {
    return this.user.get('name');
  }

  get username() {
    return this.user.get('username');
  }

  get password() {
    return this.user.get('password');
  }

  get passRepeat() {
    return this.user.get('passwordRepeat');
  }

  get telegramId() {
    return this.user.get('telegramId');
  }

  // This function is for adding required validators in different situations
  addValidators(input, tabChange = false, submit = false) {
    if (input === 'name' && this.currentTab.name === 'register') {
      if (
        (this.name.value.trim().length > 0 &&
          !this.formControlCenter.name.checkMinLength) ||
        submit
      ) {
        this.name.setValidators([
          ...this.formControlCenter.name.validators,
          ...this.formControlCenter.name.minLengthValidator,
        ]);

        this.formControlCenter.name.checkMinLength = true;
      }
      this.name.updateValueAndValidity({onlySelf: false, emitEvent: true});
    } else if (input === 'username') {
      if (tabChange) {
        if (this.currentTab.name === 'register') {
          this.username.setValidators(
            this.formControlCenter.username.validators
          );
        } else {
          this.username.clearValidators();
        }
      }
      if (
        (this.username.value.trim().length > 2 &&
          !this.formControlCenter.username.checkMinLength) ||
        submit
      ) {
        if (this.currentTab.name === 'register') {
          this.username.setValidators([
            ...this.formControlCenter.username.validators,
            ...this.formControlCenter.username.minLengthValidator,
          ]);
        } else {
          this.username.setValidators(
            this.formControlCenter.username.minLengthValidator
          );
        }

        this.formControlCenter.username.checkMinLength = true;
      }
      this.username.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    } else if (input === 'password') {
      if (tabChange) {
        if (this.currentTab.name === 'register') {
          this.password.setValidators(
            this.formControlCenter.password.validators
          );
        } else {
          this.password.clearValidators();
        }
      }

      if (
        (this.password.value.length > 5 &&
          !this.formControlCenter.password.checkMinLength) ||
        submit
      ) {
        if (this.currentTab.name === 'register') {
          this.password.setValidators([
            ...this.formControlCenter.password.validators,
            ...this.formControlCenter.password.minLengthValidator,
          ]);
        } else {
          this.password.setValidators(
            this.formControlCenter.password.minLengthValidator
          );
        }

        this.formControlCenter.password.checkMinLength = true;
      }
      this.password.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    }
  }

  codeTimer() {
    const addError = {
      hasNotBeenChecked: false,
      codeReplyError: false,
    };
    if (this.telegramId.hasError('hasNotBeenChecked')) {
      addError.hasNotBeenChecked = true;
    }
    if (this.telegramId.hasError('codeReplyError')) {
      addError.codeReplyError = true;
    }
    this.telegramId.updateValueAndValidity({
      onlySelf: false,
      emitEvent: true,
    });
    if (this.telegramId.valid) {
      const expireMillis = this.codeResponse.expirationDate.getTime();
      const currentMillis = new Date().getTime();
      const diff = -(currentMillis - expireMillis);

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      this.codeTimerMessage =
        'Код действителен: ' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds);
    }
    if (addError.hasNotBeenChecked) {

      this.telegramId.setErrors({
        hasNotBeenChecked: {
          errorMessage: 'Код не был проверен!',
        },
      });
    }
    if (addError.codeReplyError) {
      this.telegramId.setErrors({
        codeReplyError: {
          errorMessage: this.telegramResponse.message,
        },
      });
    }
    // If telegram is not valid disable submit button
    if (this.telegramId.errors !== null || this.isLoading.telegram) {
      $('form .submit-btn').css('pointer-events', 'none');
      $('form .submit-btn').css('opacity', '0.6');
    } else {
      $('form .submit-btn').css('pointer-events', 'all');
      $('form .submit-btn').css('opacity', '1');
    }
  }

  // Request Telegram code from API
  getTelegramCode() {
    if (!this.isLoading.form) {
      this.isLoading.form = true;
      this.apiService.getTelegramCode().subscribe((obs) => {
        console.log('Got code!');
        this.authResponse.showErrorResponse = false;
        this.isLoading.form = false;
        this.codeResponse = obs;
        this.codeResponse.expirationDate = new Date(this.codeResponse.expirationDate);
        this.telegramId.enable();
        this.telegramId.updateValueAndValidity({
          onlySelf: false,
          emitEvent: true,
        });
        this.telegramId.setErrors({
          hasNotBeenChecked: {
            errorMessage: 'Код не был проверен!',
          },
        });

        // To disable all inputs
        const inputs = $(`.input-form`);

        inputs.each((inputForm) => {
          const currentInputForm = $(inputs[inputForm]);
          currentInputForm.addClass('disabled-input');
        });
      }, err => {
        this.isLoading.form = false;
        this.authResponse.showErrorResponse = true;
        this.authResponse.errorMessage = err.error || 'Произошла непредвиденная ошибка. Поробуйте еще раз.';

      });
    }
  }

  // Check the status of telegram code from API
  checkTelegramCode() {
    this.telegramId.updateValueAndValidity({
      onlySelf: false,
      emitEvent: true,
    });
    if (!this.telegramId.hasError('codeExpired') && !this.isLoading.telegram) {
      this.isLoading.telegram = true;
      this.telegramResponse.message = 'Подождите...';
      this.apiService
        .checkTelegramCode(this.codeResponse.code)
        .subscribe((resp) => {
          this.telegramResponse = resp;
          this.telegramResponse.showResponse = true;
          this.isLoading.telegram = false;
          this.checkValidityOfTelegramCode();
        }, err => {
          this.telegramResponse = {
            message: 'Произошла ошибка, попробуйте еще раз.',
            valid: false,
            showResponse: true
          };
          this.isLoading.telegram = false;
          this.checkValidityOfTelegramCode();
        });
    }
  }

  checkValidityOfTelegramCode() {
    if (this.telegramResponse.valid) {
      this.telegramId.clearValidators();
      this.telegramId.setErrors(null);
      // To disable the telegram check button
      $('.telegram-verification .check-btn').css('pointer-events', 'none');
      $('.telegram-verification .check-btn').css('opacity', '0.6');
      $('.telegram-verification .check-btn').css('opacity', '0.6');
    } else {
      this.telegramId.setErrors({
        codeReplyError: {
          errorMessage: this.telegramResponse.message,
        },
      });
    }
  }

  // Function to copy code to clipboard
  copyCodeToClipboard() {
    const copiedDiv = $('.telegram-verification .text .code .copied');
    const $temp = $('<input>');

    $('body').append($temp);
    $temp.val($('.telegram-verification .text .code span').text()).select();
    document.execCommand('copy');
    $temp.remove();
    copiedDiv.addClass('copied-shown');
    setTimeout(() => {
      copiedDiv.animate(
        {
          opacity: 0,
        },
        1000,
        function () {
          copiedDiv.css('opacity', 1);
          copiedDiv.removeClass('copied-shown');
        }
      );
    }, 1000);
  }

  // Function for changin tab. When loading changed to login
  changeTab(tab, buttonName) {
    // Only change tab if:
    // 1. If clicked on the current tab
    // 2. Form is not loading
    // 3. Telegram verification has not started

    if (!this.isLoading.form && !this.telegramId.enabled && tab !== this.currentTab.name) {
      // If error was shown - hide it
      this.authResponse.showErrorResponse = false;
      this.isLoading.form = false;
      const inputs = $(`.input-form`);

      // Clicked login tab
      if (tab === 'login') {
        this.name.disable();
        this.passRepeat.disable();
        this.user.clearValidators();
        this.user.updateValueAndValidity();
        this.registerTab.removeClass('active-tab');
        this.loginTab.addClass('active-tab');
      } else if (tab === 'register') {
        this.name.enable();
        this.passRepeat.enable();
        this.user.setValidators(passwordRepeatValidator);
        this.user.updateValueAndValidity();

        this.loginTab.removeClass('active-tab');
        this.registerTab.addClass('active-tab');
      }

      // Show corresponding inputs
      inputs.each((inputForm) => {
        const currentInputForm = $(inputs[inputForm]);
        const currentInput = $(currentInputForm.find('input'));

        if (currentInputForm.hasClass(tab)) {
          currentInput.prop('disabled', false);
          currentInputForm.addClass('show-input');
        } else {
          currentInput.prop('disabled', true);
          currentInputForm.removeClass('show-input');
        }
      });
      // Delete minLengthValidator for better experience
      this.formControlCenter.name.checkMinLength = false;
      this.formControlCenter.username.checkMinLength = false;
      this.formControlCenter.password.checkMinLength = false;

      setTimeout(() => {
        this.addValidators('username', true);
        $('.show-input input[formControlName=\'username\']').trigger('input');
      }, 300);

      this.currentTab.name = tab;
      this.currentTab.buttonName = buttonName;
    }
  }

  submitForm() {
    this.addValidators('username', false, true);
    this.addValidators('password', false, true);

    if (this.currentTab.name === 'login') {
      if (this.user.valid) {
        this.isLoading.form = true;
        this.authService
          .login(this.username.value.trim(), this.password.value)
          .pipe(first())
          .subscribe(
            (data) => {
              // Succesfully logged in
              this.router.navigate([this.returnUrl]);
            },
            (error) => {
              // Error occured
              this.isLoading.form = false;
              this.authResponse.showErrorResponse = true;
              this.authResponse.errorMessage = error.error;
            }
          );
      }
    } else if (this.currentTab.name === 'register') {
      this.addValidators('name', false, true);
      // Show telegram
      if (this.telegramId.disabled) {
        console.log('Telegram is not valid. Waiting for validation.');

        if (this.user.valid) {
          // All fields correct. Show Telegram section
          this.getTelegramCode();
        }
      } else if (this.telegramId.valid) {
        this.isLoading.form = true;
        this.authService
          .register(
            new User(
              this.name.value.trim(),
              this.username.value.trim(),
              this.password.value,
              this.telegramId.value
            )
          )
          .pipe(first())
          .subscribe(
            (data) => {
              this.router.navigate([this.returnUrl]);
            },
            (error) => {
              this.isLoading.form = false;
              this.authResponse.showErrorResponse = true;
              this.authResponse.errorMessage = error.error;
            }
          );
      } else if (this.telegramId.hasError('hasNotBeenChecked')) {
        console.log('Telegram valid failed. Try again.');
      }
    }

  }

  ngAfterViewInit(): void {
    this.loginTab = $('.login-tab');
    this.registerTab = $('.register-tab');
    this.changeTab('login', 'Войти');

  }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
    this.telegramId.disable();
    this.user.valueChanges.subscribe((obs) => {
      if (this.user.hasError('passwordsDoNotMatch')) {
        if (this.passRepeat.dirty) {
          this.passRepeat.setErrors({
            passwordRepeatDoesNotMatch: {
              errorMessage: 'Пароли не совпадают.',
            },
          });
        }
      }
    });
  }
}
