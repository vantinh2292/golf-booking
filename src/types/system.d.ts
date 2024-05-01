interface ISelect {
  label: string
  value: string
  parameter: string
}
interface CustomSelectStyles extends StylesConfig {
  control?: (provided: any, state: any) => any;
  option?: (provided: any, state: any) => any;
  singleValue?: (provided: any, state: any) => any;
}