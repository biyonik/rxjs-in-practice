import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, Subscription, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import createHttpObservable from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  subscription: Subscription | null = null;
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {
    const http$: Observable<Course[]> = createHttpObservable(
      "http://localhost:9000/api/courses"
    );
    const courses$ = http$.pipe(
      tap(() => console.log("HTTP Request executed!")),
      map((res) => Object.values(res["payload"])),
      shareReplay()
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category === "ADVANCED")
      )
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
