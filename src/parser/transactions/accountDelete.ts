/**
 * AccountDelete transaction Parser
 */

import { get, isUndefined, has } from 'lodash';

import Amount from '../common/amount';
import { Destination, AmountType } from '../types';

import BaseTransaction from './base';
/* Types ==================================================================== */
import { LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class AccountDelete extends BaseTransaction {
    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get Amount(): AmountType {
        let amount;

        if (has(this, ['meta', 'DeliveredAmount'])) {
            amount = get(this, ['meta', 'DeliveredAmount']);
        } else {
            amount = get(this, ['meta', 'delivered_amount']);
        }

        // the delivered_amount will be unavailable in old transactions
        // not in this tx type, but better to check
        if (amount === 'unavailable') {
            amount = undefined;
        }

        if (isUndefined(amount)) return undefined;

        // as this only will be XRP we only check for string & number
        if (typeof amount === 'string' || typeof amount === 'number') {
            return {
                currency: 'XRP',
                value: new Amount(amount).dropsToXrp(),
            };
        }

        return undefined;
    }

    get Destination(): Destination {
        const destination = get(this, ['tx', 'Destination'], undefined);
        const destinationTag = get(this, ['tx', 'DestinationTag'], undefined);
        const destinationName = get(this, ['tx', 'DestinationName'], undefined);

        if (isUndefined(destination)) return undefined;

        return {
            name: destinationName,
            address: destination,
            tag: destinationTag,
        };
    }
}

/* Export ==================================================================== */
export default AccountDelete;
