import BigNumber from 'bignumber.js';

/* Class ==================================================================== */
class Amount {
    amount: string | number;

    constructor(amount: string | number, drops = true) {
        // validate

        if (typeof amount === 'string' && !drops) {
            if (!amount.match(/^[+-]?\d+(?:[.]*\d*(?:[eE][+-]?\d+)?)?$/)) {
                throw new Error(`invalid value '${amount}', should be a number`);
            } else if (this.amount === '.') {
                throw new Error(`invalid value '${amount}',  should be a BigNumber or string-encoded number.`);
            }
        }

        // Converting to BigNumber and then back to string should remove any
        // decimal point followed by zeros, e.g. '1.00'.
        // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
        const newAmount = new BigNumber(amount).toString(10);

        if (drops) {
            // drops are only whole units
            if (newAmount.includes('.')) {
                throw new Error(`value '${amount}' has too many decimal places.`);
            }
        }

        this.amount = newAmount;
    }

    dropsToXrp(toNumber = false): any {
        const xrp = new BigNumber(this.amount).dividedBy(1000000.0);

        if (toNumber) {
            return xrp.toNumber();
        }

        return xrp.toString(10);
    }

    xrpToDrops(toNumber = false): any {
        const drops = new BigNumber(this.amount).times(1000000.0).decimalPlaces(0);

        if (toNumber) {
            return drops.toNumber();
        }

        return drops.toString(10);
    }

    toString(decimalPlaces = 6): string {
        return new BigNumber(this.amount).decimalPlaces(decimalPlaces).toString(10);
    }

    toNumber(decimalPlaces = 6): number {
        return new BigNumber(this.amount).decimalPlaces(decimalPlaces).toNumber();
    }
}

/* Export ==================================================================== */
export default Amount;
