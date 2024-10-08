import { Person } from "./person.model";
import { Product } from "./product.model";

export interface Sale {

    cliente: Person;
    produtos: Product[];
    total: number;
}
