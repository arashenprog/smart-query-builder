import QueryExpr from './query';


const builder = new QueryExpr();

const q = builder
    .from("[users]")
    // .filter({
    //     "$or": {
    //         "[name]": ["eq", "Ali"],
    //         "$and":{
    //             "[age]" : [">",10]
    //         }
    //     },
       
    // })
    // .filter2((f)=>f.or())
    .skip(0)
    .take(10)
    .generate();
console.log(q);
