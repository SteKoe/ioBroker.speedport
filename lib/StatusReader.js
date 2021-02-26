const {get} = require("axios");
const IS_BOOLEAN_REGEX = /^true|false$/i;
const IS_INTEGER_REGEX = /^[0-9]+$/i;
const IS_FLOAT_REGEX = /^[0-9]+\.[0-9]+$/i;
const IS_DATE_REGEX = /^([0-9]{2})\.([0-9]{2})\.([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/i;

function reduceArrayItems(prev, cur) {
	let value = cur.varvalue;
	if (Array.isArray(value)) {
		value = value.reduce(reduceArrayItems, {});
	} else {
		value = mapVarvalueToTypedVarvalue(cur);
	}
	prev[cur.varid] = value;
	return prev;
}

function mapVarvalueToTypedVarvalue(obj) {
	if (IS_BOOLEAN_REGEX.test(obj.varvalue)) {
		return obj.varvalue === "true";
	} else if (IS_INTEGER_REGEX.test(obj.varvalue)) {
		return Number.parseInt(obj.varvalue);
	} else if (IS_FLOAT_REGEX.test(obj.varvalue)) {
		return Number.parseFloat(obj.varvalue);
	} else if (IS_DATE_REGEX.test(obj.varvalue)) {
		const dateValue = obj.varvalue.match(IS_DATE_REGEX);

		return new Date(
			+dateValue[3],
			+dateValue[2] - 1,
			+dateValue[1],
			+dateValue[4],
			+dateValue[5],
			+dateValue[6],
			0
		);
	}

	return obj.varvalue;
}

async function getStatusInformation(SPEEDPORT_IP) {
	const obj = {};
	try {
		const result = await get(`http://${SPEEDPORT_IP}/data/Status.json`);
		const data = result.data;
		return data.reduce(reduceArrayItems, obj);
	} catch (e) {
		return obj;
	}
}

module.exports = {
	getStatusInformation
};