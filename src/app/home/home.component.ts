import { Component, inject, OnInit } from "@angular/core";
import { Course } from "../model/course";
import {
  interval,
  Observable,
  of,
  Subscription,
  throwError,
  timer,
} from "rxjs";
import {
  catchError,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  take,
  tap,
} from "rxjs/operators";
import createHttpObservable from "../common/util";
import Store from "../common/store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  subscription: Subscription | null = null;
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  private storeService: Store = inject(Store);
  constructor() {
    const courses$ = this.storeService.courses$;

    this.beginnerCourses$ = this.storeService.selectBeginnerCourses();

    this.advancedCourses$ = this.storeService.selectAdvancedCourses();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
