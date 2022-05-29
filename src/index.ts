import { QueryExpr } from './query';
const builder = new QueryExpr();
const q = builder
    .from("users")
    .select('name', 'fname')
    .filter(c => {
       c.or(c=>{
        c.eq("name", "Arash");
        c.in("name", "Ali", "Reza");
        c.and(c=>{
            c.between("age","?",20);
        })
       });
       //c.eq("name","asghar");
       
        //c.not(c => c.in("name", "Ali", "Reza"));
    })
    .skip(0)
    .take(10)
     .generate();
console.debug(q);