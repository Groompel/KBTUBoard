import { ValidatorFn, AbstractControl, Validators, FormGroup, ValidationErrors } from "@angular/forms";

// Minimum length validator
export function minLengthValidator(n, errorMessage, trim = true): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden;
    if(trim)
      forbidden = control.value.trim().length < n;
    else
      forbidden = control.value.length < n;

    return response(forbidden, errorMessage);
  }
}

// Maximum length validator
export function maxLengthValidator(n, errorMessage, trim = true): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden;
    if(trim)
      forbidden = control.value.trim().length > n;
    else
      forbidden = control.value.length > n;

    return response(forbidden, errorMessage);
  };
}

// Any regular expression validator
export function regExpValidator(nameRe: RegExp, errorMessage): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return response(forbidden, errorMessage);
  };
}

// Unique username
export function uniqueUsernameValidator(apiService): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden = !apiService.isAvailableUsername(control.value.trim());
    return response(forbidden, "Данное имя уже занято. Попробуйте другое.");
  };
}

export function firstLetterValidator(nameRe: RegExp, errorMessage): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value[0]);
    return response(forbidden, errorMessage);
  };
}

export function lastLetterValidator(nameRe: RegExp, errorMessage): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const length = control.value.trim().length;
    const forbidden = nameRe.test(control.value[length-1]);
    return response(forbidden, errorMessage);
  };
}

// Password repeat validator
export const passwordRepeatValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const pass = control.get("password").value;
  const rep = control.get("passwordRepeat").value;

  const forbidden = pass !== rep;
  return forbidden ? {passwordsDoNotMatch: {
    errorMessage: "Пароли не совпадают."
  }} : null
};

// Telegram code validator
export function telegramCodeValidator(code, apiService): ValidatorFn {
  return (control: AbstractControl): { telegramCodeError: any } | null => {

    let response;
    apiService.checkTelegramCode(code).subscribe( resp =>  {
      response = resp;
      return !response.valid ? {telegramCodeError: {
        errorMessage: response.errorMessage,
      }} : null
    });

   return null;

  //  {telegramCodeSuccess: {
  //   id: response.id,
  //   successMessage: response.successMessage,
  // }};

  }
}

export function codeTimeValidator(expireDate): ValidatorFn {
  return (control: AbstractControl): { codeTimeExpired: any } | null => {

    const expireMillis = expireDate.getTime();
    const currentMillis = new Date().getTime();
    const diff = -(expireDate - currentMillis);

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);


    return minutes >= 10 && seconds > 3 ? {codeTimeExpired: {
      errorMessage: "Код просрочен. Для регистрации обновите страницу и попробуйте еще раз.",
      }} : null
    };
    // { codeTimeValid: {
    //   countdown: {
    //     minutes: minutes,
    //     seconds: seconds,
    //   },
    //   formattedMessage: "Код действителен: " +
    //   (minutes < 10 ? "0" + minutes : minutes) +
    //   ":" +
    //   (seconds < 10 ? "0" + seconds : seconds),
    // }}
}

// Shortcut for generating responses
function response(forbidden, errorMessage) {
  return forbidden
    ? {
        forbidden: {
          errorMessage: errorMessage,
        },
      }
    : null;
}
