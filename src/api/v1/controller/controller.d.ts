// type ControllerResponse = { status: number, result: any; };
// type ControllerResponseFn = (req: any) => Promise<ControllerResponse>;

export namespace ControllerDeclare {
  export interface typicalResponse {
    status: number;
    result: any;
  }
}
