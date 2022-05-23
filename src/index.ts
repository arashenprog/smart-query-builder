import QueryExpr from './query';


const builder = new QueryExpr();

const q = builder
    .from("[users]")
    .filter({
        "$or": {
            "[name]": ["eq", "Ali"]
        },
    })
    .skip(0)
    .take(10)
    .generate();
console.log(q);
