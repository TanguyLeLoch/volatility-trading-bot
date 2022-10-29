export class ExternalCallback {
  private readonly callbacks: Map<number, CallBackModel> = new Map<number, CallBackModel>();
  private nbRetry;

  constructor(nbRetry: number) {
    this.nbRetry = nbRetry;
  }

  addCallback(status: number, callback: CallBackModel): void {
    this.callbacks.set(status, callback);
  }

  async call(status: number): Promise<any> {
    const callback = this.callbacks.get(status);
    if (!callback) {
      throw new Error(`${status}_NOT_RETRYABLE`);
    }
    this.nbRetry--;
    if (this.nbRetry === 0) {
      throw new Error(`NO_MORE_RETRY`);
    }
    return await callback();
  }
}

type CallBackModel = () => Promise<any>;
