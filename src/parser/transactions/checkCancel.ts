import { get, isUndefined } from 'lodash';

import BaseTransaction from './base';
import CheckCreate from './checkCreate';

/* Types ==================================================================== */
import { LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class CheckCancel extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get CheckID(): string {
        return get(this, 'tx.CheckID', undefined);
    }

    get Check(): CheckCreate {
        return get(this, 'check', undefined);
    }
}

/* Export ==================================================================== */
export default CheckCancel;
