// type ControllerResponse = { status: number, result: any; };
// type ControllerResponseFn = (req: any) => Promise<ControllerResponse>;

export namespace Controller {
  export interface typicalResponse {
    status: number;
    result: any;
  }
}
