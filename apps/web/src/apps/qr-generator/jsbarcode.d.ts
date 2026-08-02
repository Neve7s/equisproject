declare module "jsbarcode" {
  function JsBarcode(
    element: HTMLCanvasElement | SVGElement | string,
    value: string,
    options?: Record<string, unknown>
  ): void;
  export default JsBarcode;
}
