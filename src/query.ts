import { DatabaseProvider, DatabaseProviders, ProviderName } from "./providers/provider";

export type FilterCondition = 'or' | 'and' | 'not';

export const KEY_FILTER = '$filter';
export const KEY_FROM = '$from';
export const KEY_QUERY = '$query';


export type FilterCallback = ((c: IFilterExpr) => void);
export type FilterRootCallback = ((c: IFilterRootExpr) => void);



export interface IFilterRootExpr {
    or(expr: FilterCallback): IFilterRootExpr;
    and(expr: FilterCallback): IFilterRootExpr;
}

export interface IFilterExpr {
    eq(field: string, value: any): IFilterExpr;
    gt(field: string, value: any): IFilterExpr;
    gte(field: string, value: any): IFilterExpr;
    lt(field: string, value: any): IFilterExpr;
    lte(field: string, value: any): IFilterExpr;
    in(field: string, ...values: any[]): IFilterExpr;
    between(field: string, val1: any, val2: any): IFilterExpr;
    or(expr: FilterCallback): IFilterExpr;
    and(expr: FilterCallback): IFilterExpr;
    not(expr: FilterCallback): IFilterExpr;
}

export class FilterRootExpr implements IFilterRootExpr {
    private _statements: any = {};
    constructor(root: any) {
        this._statements = root;
    }

    or(expr: FilterCallback): IFilterRootExpr {
        const e = new FilterExpr("or", this._statements);
        expr(e);
        return this;
    }
    and(expr: FilterCallback): IFilterRootExpr {
        const e = new FilterExpr("and", this._statements);
        expr(e);
        return this;
    }
}

export class FilterExpr implements IFilterExpr {
    private _statements: any = {};
    private _cond: FilterCondition = 'and';

    constructor(cond: FilterCondition, root: any) {
        this._cond = cond;
        root[`$${cond}`] = this._statements[`$${cond}`] = [];
    }



    private get _root_filter(): any {
        return this._statements[`$${this._cond}`];
    }


    eq(field: string, value: any): IFilterExpr {
        this._root_filter.push({
            "$eq": {
                '$f': `[${field}]`,
                '$v': value
            }
        })
        //this._root_filter[`$eq([${field}])`] = value;
        return this;
    }
    gt(field: string, value: any): IFilterExpr {
        //this._root_filter[`$gt([${field}])`] = value;
        this._root_filter.push({
            f: field,
            o: 'gt',
            v: value
        })
        return this;
    }

    gte(field: string, value: any): IFilterExpr {
        this._root_filter[`$gte([${field}])`] = value;
        return this;
    }

    lt(field: string, value: any): IFilterExpr {
        this._root_filter[`$lt([${field}])`] = value;
        return this;
    }

    lte(field: string, value: any): IFilterExpr {
        this._root_filter[`$lte([${field}])`] = value;
        return this;
    }


    in(field: string, ...values: any[]): IFilterExpr {
        //this._root_filter[`$in([${field}])`] = [...values];
        this._root_filter.push({
            "$in": {
                '$f': `[${field}]`,
                '$v': [...values]
            }
        })
        return this;
    }

    between(field: string, val1: any, val2: any): IFilterExpr {
        this._root_filter.push({
            "$between": {
                '$f': `[${field}]`,
                '$v': [val1, val2]
            }
        })
        //this._root_filter[`$between([${field}])`] = [val1, val2];
        return this;
    }

    or(expr: FilterCallback): IFilterExpr {
        const and = {}
        const e = new FilterExpr("or", and);
        expr(e);
        if (e._root_filter.length < 2)
            throw Error("OR need more than 1 operand")
        this._root_filter.push(and)
        return this;
    }
    and(expr: FilterCallback): IFilterExpr {
        const and = {}
        const e = new FilterExpr("and", and);
        expr(e);
        if (e._root_filter.length < 2)
            throw Error("AND need more than 1 operand")
        this._root_filter.push(and)
        return this;
    }

    not(expr: FilterCallback): IFilterExpr {
        // const e = new FilterExpr("not", this._root_filter);
        // expr(e);
        const not = {}
        const e = new FilterExpr("not", not);
        expr(e);
        if (e._root_filter.length != 1)
            throw Error("NOT need just 1 operand")
        this._root_filter.push(not)
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


    filter(expr: FilterCallback): QueryExpr;
    filter(expr: FilterRootCallback): QueryExpr;
    filter(expr: any): QueryExpr {
        const source = this._current_source[KEY_FILTER] = {};
        let e = null;
        // detect root filter type
        try {
            e = new FilterRootExpr(source);
            expr(e);
        }
        catch
        {
            e = new FilterExpr("and", source);
            expr(e);
        }
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

    generate(name: ProviderName='JSON'): string {
        const provider = DatabaseProviders[name] as DatabaseProvider;
        if (provider == null)
            throw Error('Invalid provider name')
        return provider.generate(this._statements);
    }

}