import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../_models/user";
import { Router } from "@angular/router";
import { USERS } from "../_backend_data/backend-data";
import { ApiService } from "../_services/api.service";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.css"],
})
export class ProfileEditComponent implements OnInit {
  user: User;

  profileInfo = new FormGroup({
    name: new FormControl("", [Validators.required]),
    gender: new FormControl(2),
    faculty: new FormControl("", [Validators.required]),
    year: new FormControl("", [Validators.required]),
    subjects: new FormArray([], [Validators.required]),
    quote: new FormControl("", [
      Validators.minLength(5),
      Validators.maxLength(150),
    ]),
    is_teaching: new FormControl(1, Validators.required),
  });

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  get name() {
    return this.profileInfo.get("name");
  }

  get gender() {
    return this.profileInfo.get("gender");
  }

  get faculty() {
    return this.profileInfo.get("faculty");
  }

  get year() {
    return this.profileInfo.get("year");
  }

  get subjects(): FormArray {
    return this.profileInfo.get("subjects") as FormArray;
  }

  get quote() {
    return this.profileInfo.get("quote");
  }

  addSubject(subject: string) {
    this.subjects.push(new FormControl(subject, [Validators.required]));
  }

  submitForm() {
    this.user.name = this.name.value;
    this.user.faculty = this.faculty.value;
    this.user.gender = this.gender.value;
    this.user.teacher_info.faculty = this.faculty.value;
    this.user.teacher_info.subjects = this.subjects.value;
    this.user.teacher_info.quote = this.quote.value;
    this.apiService.setUser(this.user);
    this.router.navigate(["/profile"]);
  }

  ngOnInit(): void {
    // this.authService.currentUser.subscribe(u => this.updateUser(u));
    this.apiService
      .getUserInfo(this.authService.currentUserValue.username)
      .subscribe((user) => {
        this.user = user;
        this.user.username = this.authService.currentUserValue.username;
        this.updateUser(this.user)
      });
  }

  updateUser(user: User) {
    this.subjects.clear();
    this.user = user;
    this.name.setValue(user.name);
    this.gender.setValue(user.gender);
    this.faculty.setValue(user.faculty);
    this.year.setValue(user.year_of_study);
    if (user.teacher_info) {
      this.quote.setValue(user.teacher_info.quote);
      user.teacher_info.subjects.forEach((subject) => this.addSubject(subject));
    }
  }
}
