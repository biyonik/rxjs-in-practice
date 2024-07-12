import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { Course } from "../model/course";
import createHttpObservable from "./util";
import { delayWhen, map, retryWhen, shareReplay, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export default class Store {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable(`http://localhost:9000/api/courses`);

    http$
      .pipe(
        tap(() => console.log("HTTP Request Executed!")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe((courses: Course[]) => this.subject.next(courses));
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.#filterByCategory("BEGINNER");
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.#filterByCategory("ADVANCED");
  }

  #filterByCategory(categoryName: string) {
    return this.courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category === categoryName)
      )
    );
  }
}
