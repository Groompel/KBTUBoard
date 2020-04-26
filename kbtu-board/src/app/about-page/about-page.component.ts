import {Component, OnInit} from '@angular/core';
import{FormGroup, FormControl} from '@angular/forms'

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {

  reviewForm :FormGroup;

  constructor() {
    this.reviewForm=new FormGroup({review:new FormControl('I think....')});
  }

  ngOnInit(): void {
  }

}
