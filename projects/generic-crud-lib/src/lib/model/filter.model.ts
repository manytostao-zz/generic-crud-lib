export class Filter {
  Path: string;

  Value: any;

  Value2: any;

  LogicalOperation: string;

  Operator: string;

  constructor(Path: string, Value: any, Value2: any, LogicalOperation: string, Operator: string) {
    this.Path = Path;
    this.Value = Value;
    this.Value2 = Value2;
    this.LogicalOperation = LogicalOperation;
    this.Operator = Operator;
  }
}
