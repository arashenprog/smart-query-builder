import { QueryExpr } from './query';
const builder = new QueryExpr();
const q = builder
    //.from(["users",'u'],['roles','r'])

    // .from("users","u")
    // .from("roles","r")

    //.from({"u":"Users"},"Roles")

    
    .from("users")
    .select('name', 'fname')
    .filter(c => {
        c.or(c => {
            c.eq("name", "Arash");
            c.in("name", "Ali", "Reza");
            c.not(c =>
                c.and(c => {
                    c.between("age", 10, 20);
                    c.not(c => { c.between("weight", 50, 60) });
                })
            )
        });
        //c.eq("name","asghar");

        //c.not(c => c.in("name", "Ali", "Reza"));
    })
    .skip(0)
    .take(10)
    .generate('JSON');
console.debug(q);


/*

WHERE
not (name = 'Arash') or name in ('Ali','Reza') or not ((age between(10,20)  and weight between(50,60)))

*/ 