export default class QueryExpr {

    private _statements: any = {
        "$query": {}
    };



    private get _root_query(): any {
        return this._statements["$query"];
    }

    private get _root_from(): any {
        if (!this._root_query["$from"])
            this._root_query["$from"] = {}
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
        this._current_source = this._root_from[`${source}`] = {};
        return this;
    }

    select(expr: string): QueryExpr {
        this._current_source[`$select`] = expr;
        return this;
    }

    filter(value: { [cond in '$or' | '$and']?: { [name: string]: string[] } }): QueryExpr {
        this._current_source['$filter'] = value
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
        return JSON.stringify(this._statements);
    }

}