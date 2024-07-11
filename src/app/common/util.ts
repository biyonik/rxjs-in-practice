import { Observable } from "rxjs";

export default function createHttpObservable<T>(url: string) {
  return new Observable<T>((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {
      signal,
    })
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    return () => controller.abort();
  });
}
