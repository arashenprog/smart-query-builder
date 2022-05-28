import { IFilterExpr, QueryExpr } from './query';
const builder = new QueryExpr();
const q = builder
    .from("users")
    .filter("or", (c: IFilterExpr) => {
        c.eq("name", "Ali");
        c.filter("and", (c) => {
            c.gtn("age", 10);
            c.eq("address", "isf");
        });
    })
    .skip(0)
    .take(10)
    .generate();
console.debug(q);