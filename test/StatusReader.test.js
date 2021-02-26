import { expect } from "chai";
import {mapVarvalueToTypedVarvalue, reduceArrayItems} from "../lib/StatusReader.js";

describe('StatusReader', () => {
    it('reduces the given vartype -id -value structure', () => {
        const cur = {
            "vartype": "value",
            "varid": "dsl_downstream",
            "varvalue": "108607"
        };
        const result = reduceArrayItems({}, cur);
        expect(result).equals({"dsl_downstream": 108607})
    });

    it('reduces the given vartype -id -value structure including arrays', () => {
        const cur = {
            "vartype": "template",
            "varid": "addphonenumber",
            "varvalue": [
                {
                    "vartype": "value",
                    "varid": "id",
                    "varvalue": "1"
                },
                {
                    "vartype": "value",
                    "varid": "field",
                    "varvalue": "2"
                }
            ]
        };
        const result = reduceArrayItems({}, cur);
        expect(result).equals({"addphonenumber": {"id": 1, "field": 2}})
    });

    test.each`
      obj                                                                       | expected
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": ""}}        | ${""}
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": "false"}}   | ${false}
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": "1230"}}    | ${1230}
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": "12.30"}}   | ${12.30}
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": "12.3.0"}}  | ${"12.3.0"}
      ${{"vartype": "status", "varid": "apmode_active", "varvalue": "23.02.2021 15:44:59"}}  | ${new Date(2021, 1, 23, 15, 44, 59, 0)}
    `('Converts object to "$expected"', ({obj, expected}) => {
        let result = mapVarvalueToTypedVarvalue(obj);
        expect(result).equals(expected);
    });
});