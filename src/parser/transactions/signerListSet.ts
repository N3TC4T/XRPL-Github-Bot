import { get, isUndefined, flatMap } from 'lodash';

import BaseTransaction from './base';

/* Types ==================================================================== */
import { SignerEntry , LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class SignerListSet extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get SignerQuorum(): string {
        return get(this, ['tx', 'SignerQuorum']);
    }

    get SignerEntries(): Array<SignerEntry> {
        const entries = get(this, ['tx', 'SignerEntries']);

        return flatMap(entries, (e) => {
            return { account: e.SignerEntry.Account, weight: e.SignerEntry.SignerWeight };
        });
    }
}

/* Export ==================================================================== */
export default SignerListSet;
