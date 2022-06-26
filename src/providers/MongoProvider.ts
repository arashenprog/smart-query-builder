import { IProvider } from "./IProvider";



export class MongoProvider implements IProvider {
    generate(statements: any): string {

     var  statements1 = {
            "$query": {
                "$from": {
                    "$select": {
                        "nameCountries": "[name]",
                        "codeCountries": "[code]"
                    },
                    "$source": "smart_common_countries"
                }
            }
        }

        var  statements2 = {
            "$query": {
                "$from": {
                    "$select": {
                        "nameCountries": "[name]",
                        "codeCountries": "[code]"
                    },
                    "$source": "smart_common_countries",
                    "$sort": {
                        "nameCountries": "asc",
                        "codeCountries": "desc"
                    },
                    "$skip": 0,
                    "$take": 10
                }
            }
        }
      var statements3 = {
            "$query": {
                "$from": {
                    "$select": {
                        "nameCountries": "[name]",
                        "codeCountries": "[code]"
                    },
                    "$source": "smart_common_countries",
                    "$filter": {
                        "$and": [
                            {
                                "codeCountries": {
                                    "$eq": "AI"
                                }
                            }
                        ],
                        "$or": [
                            {
                                "nameCountries": {
                                    "$eq": "Zimbabwe"
                                }
                            },
                            {
                                "nameCountries": {
                                    "$eq": "Anguilla"
                                }
                            }
                        ]
                    },
                    "$sort": {
                        "nameCountries": "asc",
                        "codeCountries": "desc"
                    },
                    "$skip": 0,
                    "$take": 10
                }
            }
        }
        var statements4 = {
            "$query": {
                "$from": {
                    "$select": {
                        "nameTimeZonees": "[name]",
                        "offsetTimeZonees": "[offset]",
                        "codeTimeZonees" :"[code]"
                    },
                    "$source": "smart_common_timezones",
                    "$filter": {
                        "$and": [
                            {
                                "codeTimeZonees": {
                                    "$eq": "GTB Standard Time"
                                }
                            }
                        ],
                        "$or": [
                            {
                                "nameTimeZonees": {
                                    "$eq": "Zimbabwe"
                                }
                            },
                            {
                                "offsetTimeZonees": {
                                    "$gt": "0"
                                }
                            }
                        ]
                    },
                    "$sort": {
                        "nameTimeZonees": "asc",
                        "offsetTimeZonees": "desc"
                    },
                    "$skip": 0,
                    "$take": 10
                }
            }
        }

/*
Aggregation Pipeline

1  $match    
2  $group
3  $sort
4  $project

*/

        statements = statements4;
        var query = 'db.'
        query = query + statements.$query.$from.$source + '.aggregate(['

        if (statements.$query.$from.$filter) {
            query = query + this.getFilter(statements.$query.$from.$filter, statements.$query.$from.$select)
            query = query + ',';
        }
      
        if (statements.$query.$from.$sort) {
            query = query + this.getSort(statements.$query.$from.$sort, statements.$query.$from.$select);
            query = query + ',';
        }
      
        if (statements.$query.$from.$select) {
            query = query + this.getSelect(statements.$query.$from.$select);
        }
        // query = query + ',';
        // query = query.substring(0, query.length - 1)
        // add skip take
        if(statements.$query.$from.$take){
            query = query + ',';
            query = query + '{' + '$limit : ' +  statements.$query.$from.$take + '},'
        }
        if(statements.$query.$from.$skip){
            query = query + '{' + '$skip : ' +  statements.$query.$from.$skip + '}'
        }else if(statements.$query.$from.$take){
            query = query + '{$skip :0}'
        }
        query = query + '])';
        console.log(query)
        return query;
    }


    private getSelect(select: any): string {

        var result = '{ $project:{'
        for (var key in select) {
            result = result + key + ':"$' + select[key].replace(/[[\]]/g, '') + '"'
            result = result + ','
        }

        result = result.substring(0, result.length - 1)
        result = result + '} }'
        return result;
    }

    private getFilter(filter: any, select: any): string {
        var result = '{ $match:{'
        for (var key in filter) {
            result = result + key + ':['
            for (let index = 0; index < filter[key].length; index++) {
                result = result + '{';
                for (var name in filter[key][index]) {
                    result = result + select[name].replace(/[[\]]/g, '') + ':'
                    for (var atr in filter[key][index][name]) {
                        if (atr == '$eq') {
                            result = result + "'" + filter[key][index][name][atr] + "'"
                        }
                        if(atr == '$gt'){
                                result = result + '{ $gt : ' + filter[key][index][name][atr] + '}'
                        }
                    }
                }
                result = result + '},';
            }
            result = result.substring(0, result.length - 1)
            result = result + '],'
        }

        result = result.substring(0, result.length - 1)
        result = result + '} }'
        return result;
    }

    private getSort(sort: any, select: any) {

        var result = '{ $sort:{'
        for (var key in sort) {
            let name = select[key].replace(/[[\]]/g, '');
            result = result + name + ':' + (sort[key] == 'asc' ? '1' : '-1')
            result = result + ','
        }

        result = result.substring(0, result.length - 1)
        result = result + '} }'
        return result;
    }

}