import { QueryExpr } from './query';
const builder = new QueryExpr();
const q = builder
    .from("users")
    .select('name', 'fname')
    // .where(c => {
    //     c.and(c => {
    //         c.eq("name", "Ali");
    //         c.or((c) => {
    //             c.gtn("age", 10);
    //             c.eq("address", "isf");
    //         });
    //     })
    // })
    .orWhere(c => {
        c.eq("name", "Ali");
        c.and((c) => {
            c.gt("age", 10);
            c.lt("age", 20);
            c.or(c => c.between("age", 40, 50))
        });
    })
    .skip(0)
    .take(10)
    .generate();
console.debug(q);