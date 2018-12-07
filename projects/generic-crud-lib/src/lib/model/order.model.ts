export class Order {
  Path: string;

  Ascending: boolean;

  constructor(Ascending: boolean, Path: string) {
    this.Ascending = Ascending;
    this.Path = Path;
  }
}
