
export type WhereCondition = 'or' | 'and';

export const KEY_WHERE = '$where';
export const KEY_FROM = '$from';
export const KEY_QUERY = '$query';



export interface IWhereRootExpr {
    or(expr: (c: IWhereExpr) => void): IWhereRootExpr;
    and(expr: (c: IWhereExpr) => void): IWhereRootExpr;
}

export interface IWhereExpr {
    eq(field: string, value: any): IWhereExpr;
    gt(field: string, value: any): IWhereExpr;
    lt(field: string, value: any): IWhereExpr;
    between(field: string, val1: any,val2: any): IWhereExpr;
    or(expr: (c: IWhereExpr) => void): IWhereExpr;
    and(expr: (c: IWhereExpr) => void): IWhereExpr;
}

export class WhereRootExpr implements IWhereRootExpr {
    private _statements: any = {};
    constructor(root: any) {
        this._statements = root;
    }

    or(expr: (c: IWhereExpr) => void): IWhereRootExpr {
        const e = new WhereExpr("or", this._statements);
        expr(e);
        return this;
    }
    and(expr: (c: IWhereExpr) => void): IWhereRootExpr {
        const e = new WhereExpr("and", this._statements);
        expr(e);
        return this;
    }
}

export class WhereExpr implements IWhereExpr {
    private _statements: any = {};
    private _cond: WhereCondition = 'and';

    constructor(cond: WhereCondition, root: any) {
        this._cond = cond;
        root[`$${cond}`] = this._statements[`$${cond}`] = {};
    }

 

    private get _root_filter(): any {
        return this._statements[`$${this._cond}`];
    }


    eq(field: string, value: any): IWhereExpr {
        this._root_filter[`$eq([${field}])`] = value;
        return this;
    }
    gt(field: string, value: any): IWhereExpr {
        this._root_filter[`$gt([${field}])`] = value;
        return this;
    }
    
    lt(field: string, value: any): IWhereExpr {
        this._root_filter[`$lt([${field}])`] = value;
        return this;
    }

    between(field: string, val1: any, val2: any): IWhereExpr {
        this._root_filter[`$between([${field}])`] = [val1,val2];
        return this;
    }

    or(expr: (c: IWhereExpr) => void): IWhereExpr {
        const e = new WhereExpr("or", this._root_filter);
        expr(e);
        return this;
    }
    and(expr: (c: IWhereExpr) => void): IWhereExpr {
        const e = new WhereExpr("and", this._root_filter);
        expr(e);
        return this;
    }
}



export class QueryExpr {

    private _statements: any = {};

    private get _root_query(): any {
        return this._statements[KEY_QUERY];
    }

    private get _root_from(): any {
        if (!this._root_query[KEY_FROM])
            this._root_query[KEY_FROM] = {}
        return this._root_query[KEY_FROM];
    }

    private _current_source: any;

    /**
     *
     */
    constructor() {
        this._statements[KEY_QUERY] = {};
        this.select();
    }

    from(source: string): QueryExpr {
        this._current_source = this._root_from[`[${source}]`] = {};
        return this;
    }

    select(...fields: string[]): QueryExpr {
        this._root_from[`$select`] = fields.length == 0 ? "*" : fields.map(c => `[${c}]`);
        return this;
    }


    where(expr: (c: IWhereRootExpr) => void): QueryExpr {
        this._current_source[KEY_WHERE] = {};
        const e = new WhereRootExpr(this._current_source[KEY_WHERE]);
        expr(e);
        return this;
    }

    andWhere(expr: (c: IWhereExpr) => void): QueryExpr {
        return this.where(c => c.and(expr));
    }

    orWhere(expr: (c: IWhereExpr) => void): QueryExpr {
        return this.where(c => c.or(expr));
    }

    skip(value: number = 0) {
        this._root_query["$skip"] = value;
        return this;
    }

    take(value: number = 0) {
        this._root_query["$take"] = value;
        return this;
    }


    generate(): string {
        return JSON.stringify(this._statements, null, 4);
    }

}