import { Supplier, Product, Order, OrderItem } from "./orderModels";
import { firebaseDb } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const suppliersCollection = collection(firebaseDb, "suppliers");
  const snapshot = await getDocs(suppliersCollection);
  return snapshot.docs.map((doc) => new Supplier(doc.id, doc.data().name));
}

export async function fetchProducts(
  queryText: string,
  supplierId: string,
): Promise<Product[]> {
  const productsCollection = collection(firebaseDb, "products");
  const supplierRef = doc(firebaseDb, "suppliers", supplierId);

  const q = query(
    productsCollection,
    where("supplier", "==", supplierRef),
    where("name", ">=", queryText),
    where("name", "<=", queryText + "\uf8ff"),
  );

  console.log(q);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => new Product(doc.id, doc.data().name, doc.data().supplierId),
  );
}

export async function saveOrder(orderData: Order): Promise<boolean> {
  const ordersCollection = collection(firebaseDb, "orders");
  const orderDoc = await addDoc(ordersCollection, {
    supplier: doc(firebaseDb, "suppliers", orderData.supplier.id),
    notes: orderData.notes,
    items: orderData.items.map((item) => ({
      product: doc(firebaseDb, "products", item.product.id),
      quantity: item.quantity,
      price: item.price,
    })),
  });
  console.log("Order saved with ID:", orderDoc.id);

  return true;
}

export async function sendOrder(): Promise<void> {
  // Simulate sending the order as EDI 850 to an FTP server
  console.log("Order sent as EDI 850");
}

export async function fetchOrders(): Promise<Order[]> {
  const ordersCollection = collection(firebaseDb, "orders");
  const snapshot = await getDocs(ordersCollection);

  return await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Fetch full supplier details
      const supplierDoc = await getDoc(data.supplier);
      const supplier = new Supplier(
        supplierDoc.id,
        (supplierDoc.data() as Supplier)?.name,
      );

      // Fetch full product details for each item
      const items = await Promise.all(
        data.items.map(async (item: any) => {
          const productDoc = await getDoc(item.product);
          const product = new Product(
            productDoc.id,
            (productDoc.data() as Product)?.name,
            supplier, // Assuming the product's supplier is the same as the order's supplier
          );
          return new OrderItem(product, item.quantity, item.price);
        }),
      );

      return new Order(supplier, data.notes, items);
    }),
  );
}
