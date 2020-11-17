import { has, get, set, isUndefined, isNumber, toInteger } from 'lodash';

import BaseTransaction from './base';
import Amount from '../common/amount';
import LedgerDate from '../common/date';

/* Types ==================================================================== */
import { LedgerTransactionType,  AmountType, Destination } from '../types';

/* Class ==================================================================== */
class EscrowCreate extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
   }

    get Amount(): AmountType {
        const amount = get(this, ['tx', 'Amount']);

        if (isUndefined(amount)) return undefined;

        return {
            currency: 'XRP',
            value: new Amount(amount).dropsToXrp(),
        };
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

    get Condition(): string {
        return get(this, ['tx', 'Condition']);
    }

    get CancelAfter(): any {
        const date = get(this, ['tx', 'CancelAfter'], undefined);
        if (isUndefined(date)) return undefined;
        const ledgerDate = new LedgerDate(date);
        return ledgerDate.toISO8601();
    }

    get FinishAfter(): any {
        const date = get(this, ['tx', 'FinishAfter'], undefined);
        if (isUndefined(date)) return undefined;
        const ledgerDate = new LedgerDate(date);
        return ledgerDate.toISO8601();
    }
}

/* Export ==================================================================== */
export default EscrowCreate;
