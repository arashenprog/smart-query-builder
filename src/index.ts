import { IFilterExpr, QueryExpr } from './query';

const builder = new QueryExpr();

const q = builder
    .from("users")
    // .filter({
    //     "$or": {
    //         "[name]": ["eq", "Ali"],
    //         "$and": {
    //             "[age]": [">", 10]
    //         }
    //     },

    // })
    .filter("or", (c: IFilterExpr) => {
        c.eq("name", "Ali");
        c.filter("and", (c) => {
            c.gtn("age", 10);
        });
    })
    .skip(0)
    .take(10)
    .generate();
console.log(q);
