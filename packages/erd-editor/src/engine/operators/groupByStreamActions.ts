import { AnyAction } from '@dineug/r-html';
import { buffer, debounceTime, groupBy, map, mergeMap, Observable } from 'rxjs';

import { notEmptyActions } from '@/engine/operators/notEmptyActions';

export const groupByStreamActions =
  (streamActionTypes: Array<string> | ReadonlyArray<string>) =>
  (source$: Observable<Array<AnyAction>>) =>
    new Observable<Array<AnyAction>>(subscriber =>
      source$.subscribe({
        next: actions => {
          const batchActions: AnyAction[] = [];
          const streamActions: AnyAction[] = [];

          actions.forEach(action =>
            streamActionTypes.includes(action.type)
              ? streamActions.push(action)
              : batchActions.push(action)
          );

          subscriber.next(batchActions);
          subscriber.next(streamActions);
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      })
    ).pipe(
      notEmptyActions,
      groupBy(actions =>
        actions.some(action => streamActionTypes.includes(action.type))
      ),
      mergeMap(group$ =>
        group$.key
          ? group$.pipe(
              buffer(group$.pipe(debounceTime(200))),
              map(buff => buff.reduce((acc, cur) => acc.concat(cur), []))
            )
          : group$
      )
    );