export interface ChartDatum {
  open: number;
  high: number;
  low: number;
  Close: number;
  volume: number;

  Date: Date;
}

export type ChartType = "CANDLE_STICK" | "AREA_STICK";

export type ChartComponentProps = {
  data: Array<ChartDatum>;
  cwidth?: number;
  cheight?: number;

  fixedTooltip?: boolean;
};
