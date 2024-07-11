import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import createHttpObservable from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`http://localhost:9000/api/courses/${this.courseId}`);

    }

    ngAfterViewInit() {

        const searchLessons$ = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            );

        const initialLessons$ = this.loadLessons();

        this.lessons$ = concat(initialLessons$, searchLessons$);



    }

    private loadLessons(searchTerm: string = ''): Observable<Lesson[]> {
        return createHttpObservable(`http://localhost:9000/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
        .pipe(
            map(res => res['payload']),
        );
    }




}
