import { get, isUndefined } from 'lodash';

import BaseTransaction from './base';

/* Types ==================================================================== */
import { LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class SetRegularKey extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get RegularKey(): string {
        return get(this, ['tx', 'RegularKey']);
    }
}

/* Export ==================================================================== */
export default SetRegularKey;
