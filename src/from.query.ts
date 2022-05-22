export class FromQuery {

    private _statements:any[]=[];

    from(source: string): FromQuery {
        this._statements['from'] ={}
        console.log(`source: ${source}`);
        return this;
    }
    
    as(name:string)
    {
        return this;
    }

    
}