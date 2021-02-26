const stateAttributes = require("./lib/stateAttributes");
const {getStatusInformation} = require("./lib/StatusReader");
const {Adapter} = require("@iobroker/adapter-core");

class Speedport extends Adapter {

	constructor(options) {
		super({
			...options,
			name: "speedport",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	async onReady() {
		await this.upsertStateObjects();
		await this.startMetricsPolling();
	}

	async startMetricsPolling() {
		await this.pollMetrics();
		this.pollMetricsInterval = setInterval(this.pollMetrics.bind(this), this.config.pollInterval * 1000);
	}

	async upsertStateObjects() {
		for (const name of Object.keys(stateAttributes)) {
			const writable = stateAttributes[name].write || false;
			const state_name = stateAttributes[name].name || name;
			const role = stateAttributes[name].role || "value";
			const type = stateAttributes[name].type || "string";
			const unit = stateAttributes[name].unit || "";

			await this.setObjectNotExistsAsync(name, {
				type: "state",
				common: {
					name: state_name,
					role: role,
					type: type,
					unit: unit,
					read: true,
					write: writable
				},
				native: {},
			});

			// Ensure name changes are propagated
			await this.extendObjectAsync(name, {
				type: "state",
				common: {
					name: state_name,
				},
			});
		}
	}

	async pollMetrics() {
		try {
			const information = await getStatusInformation(this.config.routerIp);

			for (const name of Object.keys(stateAttributes)) {
				const value = information[name];
				await this.setState(name, {val: value, ack: true});
			}

			await this.setState("last_update", {val: new Date(), ack: true});
		} catch (e) {
			this.log.error("Error fetching metrics for Speedport router on IP " + this.config.routerIp);
		}
	}

	onUnload(callback) {
		this.log.info("iobroker.speedport onUnload");
		clearInterval(this.pollMetricsInterval);

		try {
			callback();
		} catch (e) {
			callback();
		}
	}
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Speedport(options);
} else {
	// otherwise start the instance directly
	new Speedport();
}