/**
 * TrustLine transaction Parser
 */

import { get, set, isUndefined, toNumber } from 'lodash';
import BaseTransaction from './base';

/* Types ==================================================================== */
import { LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class TrustSet extends BaseTransaction {
    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get Currency(): string {
        return get(this, ['tx', 'LimitAmount', 'currency'], undefined);
    }

    get Issuer(): string {
        return get(this, ['tx', 'LimitAmount', 'issuer'], undefined);
    }

    get Limit(): number {
        return toNumber(get(this, ['tx', 'LimitAmount', 'value'], 0));
    }

    get QualityIn(): any {
        return get(this, ['tx', 'QualityIn'], 0);
    }

    get QualityOut(): any {
        return get(this, ['tx', 'QualityOut'], 0);
    }
}

/* Export ==================================================================== */
export default TrustSet;
