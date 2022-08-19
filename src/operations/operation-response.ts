class OperationResponse {
  private readonly success: boolean;
  private message: string;
  private readonly resData: any;

  constructor(success = false, resData: any = null, message = 'ok') {
    this.success = success;
    this.message = message;
    this.resData = resData;
  }

  public isSuccess() {
    return this.success;
  }

  public getData() {
    return this.resData;
  }
}

export default OperationResponse;
