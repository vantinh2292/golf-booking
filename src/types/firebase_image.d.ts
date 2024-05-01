interface IMapData {
  Height: number;
  Location1_lat: number;
  Location1_long: number;
  Location2_lat: number;
  Location2_long: number;
  Point1_pixel_left: number;
  Point1_pixel_top: number;
  Point2_pixel_left: number;
  Point2_pixel_top: number;
  Url: string;
  Width: number;
}

interface IMapDataCollection {
  MB_A: MapData;
  MB_B: MapData;
  MB_C: MapData;
  MB_D: MapData;
  MB_Tong_The: MapData;
}
interface YardData {

  1: HoldData,
  2: HoldData,
  3: HoldData,
  4: HoldData,
  5: HoldData,
  6: HoldData,
  7: HoldData,
  8: HoldData,
  9: HoldData

};
interface HoldData {
  Blue: number;
  Gold: number;
  Index: number;
  Par: number;
  Red: number;
  White: number;
};
interface TableRow {
  Blue: number;
  Gold: number;
  Index: number;
  Par: number;
  Red: number;
  White: number;
}