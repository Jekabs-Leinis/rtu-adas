export class Supplier {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

export class Product {
  constructor(
    public id: string,
    public name: string,
    public supplier: Supplier,
  ) {}
}

export class OrderItem {
  constructor(
    public product: Product,
    public quantity: number,
    public price: number,
  ) {}
}

export class Order {
  constructor(
    public supplier: Supplier,
    public notes: string,
    public items: OrderItem[],
  ) {}
}
