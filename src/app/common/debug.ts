import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

export const debug = (level: number, message: string) => (source: Observable<any>) => source.pipe(
    tap(val => {
        switch (level) {
            case RxJsLoggingLevel.TRACE:
                console.trace(message, val);
                break;
            case RxJsLoggingLevel.DEBUG:
                console.debug(message, val);
                break;
            case RxJsLoggingLevel.INFO:
                console.info(message, val);
                break;
            case RxJsLoggingLevel.ERROR:
                console.error(message, val);
                break;
        }
    })
)