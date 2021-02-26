const stateAttributes = {
	"last_update": {
		name: "Last update",
		role: "date"
	},
	"dsl_upstream" : {
		name: "DSL Upstream",
		type: "number",
		unit: "kbit/s"
	},
	"dsl_downstream" : {
		name: "DSL Downstream",
		type: "number",
		unit: "kbit/s"
	},
	"onlinestatus": {
		name: "Online Status"
	},
	"dsl_link_status" : {
		name: "DSL Link Status"
	},
	"use_wlan": {
		name: "Is WiFi enabled?",
		type: "boolean"
	},
	"wlan_ssid": {
		name: "WiFi SSID"
	},
	"use_wlan_5ghz": {
		name: "Is WiFi (5GHz) enabled?",
		type: "boolean"
	},
	"wlan_5ghz_ssid": {
		name: "WiFi SSID (5GHz)"
	},
	"wlan_devices": {
		name: "Number of devices connected to WiFi",
		type: "number"
	},
	"wlan_5ghz_devices": {
		name: "Number of devices connected to 5GHz WiFi",
		type: "number"
	},
	"firmware_version": {
		name: "Firmware version"
	},
	"serial_number": {
		name: "Serial number"
	},
	"wlan_guest_active": {
		name: "Is Guest WiFi access enabled?",
		type: "boolean"
	},
	"wlan_guest_ssid": {
		name: "Guest WiFi SSID",
	},
	"wlan_guest_count": {
		name: "Number of devices connected to guest Wifi",
		type: "number"
	},
	"datetime": {
		name: "Date time of last update on router's side."
	}
};

module.exports = stateAttributes;