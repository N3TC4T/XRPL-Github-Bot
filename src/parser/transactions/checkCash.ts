import { get, isUndefined } from 'lodash';

import BaseTransaction from './base';
import CheckCreate from './checkCreate';

import Amount from '../common/amount';

/* Types ==================================================================== */
import { AmountType, LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class CheckCash extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get Amount(): AmountType {
        const amount = get(this, ['tx', 'Amount'], undefined);

        if (!amount) {
            return undefined;
        }

        if (typeof amount === 'string') {
            return {
                currency: 'XRP',
                value: new Amount(amount).dropsToXrp(),
            };
        }

        return {
            currency: amount.currency,
            value: amount.value && new Amount(amount.value, false).toString(),
            issuer: amount.issuer,
        };
    }

    get DeliverMin(): AmountType {
        const deliverMin = get(this, ['tx', 'DeliverMin'], undefined);

        if (!deliverMin) {
            return undefined;
        }

        if (typeof deliverMin === 'string') {
            return {
                currency: 'XRP',
                value: new Amount(deliverMin).dropsToXrp(),
            };
        }

        return {
            currency: deliverMin.currency,
            value: deliverMin.value && new Amount(deliverMin.value, false).toString(),
            issuer: deliverMin.issuer,
        };
    }

    get CheckID(): string {
        return get(this, 'tx.CheckID', undefined);
    }

    get Check(): CheckCreate {
        return get(this, 'check', undefined);
    }
}

/* Export ==================================================================== */
export default CheckCash;
