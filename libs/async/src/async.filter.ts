import { AsyncStatus } from './async.call';

export type AsyncFilter = {
  status: AsyncStatus;
  dateToCallLessThan: Date;
};
