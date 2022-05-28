
export type WhereCondition = 'or' | 'and';


export interface IFilterExpr {
    eq(feild: string, value: any): IFilterExpr;
    gtn(feild: string, value: any): IFilterExpr;
    ltn(feild: string, value: any): IFilterExpr;
    filter(op: WhereCondition, expr: (c: IFilterExpr) => void): IFilterExpr;
}

export class FilterExpr implements IFilterExpr {
    private _statements: any = {};
    private _cond: WhereCondition = 'and';

    constructor(cond: WhereCondition, root: any) {
        this._cond = cond;
        root[`$${cond}`] = this._statements[`$${cond}`] = {};
    }

    private get _root_filter(): any {
             return this._statements[`$${this._cond}`];
    }

    eq(feild: string, value: any): IFilterExpr {
         this._root_filter[`[${feild}]`] = ['eq', value]; 
        return this;
    }
    gtn(feild: string, value: any): IFilterExpr {
        this._root_filter[`[${feild}]`] = ['>', value];
        return this;
    }
    ltn(feild: string, value: any): IFilterExpr {
        this._root_filter[`[${feild}]`] = ['<', value];
        return this;
    }
    filter(cond: WhereCondition, expr: (c: IFilterExpr) => void): IFilterExpr {
        const e = new FilterExpr(cond, this._root_filter);
        expr(e);
        return this;
    }

}



export class QueryExpr {

    private _statements: any = {
        "$query": {}
    };



    private get _root_query(): any {
        return this._statements["$query"];
    }

    private get _root_from(): any {
        if (!this._root_query["$from"])
            this._root_query["$from"] = { "$select": "*" }
        return this._root_query["$from"];
    }

    private _current_source: any;

    /**
     *
     */
    constructor() {
        this._statements["$query"] = {};
    }

    from(source: string): QueryExpr {
        this._current_source = this._root_from[`[${source}]`] = {};
        return this;
    }

    select(expr: string): QueryExpr {
        this._current_source[`$select`] = expr;
        return this;
    }


    filter(cond: WhereCondition, expr: (c: IFilterExpr) => void): QueryExpr {
        this._current_source['$filter'] = {};
        const e = new FilterExpr(cond, this._current_source['$filter']);
        expr(e);
        return this;
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