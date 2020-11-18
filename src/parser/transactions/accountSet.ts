/**
 * AccountSet transaction Parser
 */

import BigNumber from 'bignumber.js';
import { get, isUndefined } from 'lodash';

import BaseTransaction from './base';
import Flag from '../common/flag';
import HexEncoding from '../common/hex'

/* Types ==================================================================== */
import { LedgerTransactionType } from '../types';

/* Class ==================================================================== */
class AccountSet extends BaseTransaction {
    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get SetFlag(): string {
        const intFlag = get(this, ['tx', 'SetFlag'], undefined);
        if (isUndefined(intFlag)) return undefined;
        const flag = new Flag(this.Type, intFlag);
        return flag.parseIndices();
    }

    get ClearFlag(): string {
        const intFlag = get(this, ['tx', 'ClearFlag'], undefined);
        if (isUndefined(intFlag)) return undefined;
        const flag = new Flag(this.Type, intFlag);
        return flag.parseIndices();
    }

    get Domain(): string {
        const domain = get(this, ['tx', 'Domain'], undefined);
        if (domain) {
            return HexEncoding.toString(domain);
        }
        return domain;
    }

    get MessageKey(): string {
        return get(this, ['tx', 'MessageKey'], undefined);
    }

    get EmailHash(): string {
        return get(this, ['tx', 'EmailHash'], undefined);
    }

    get TransferRate(): number {
        const transferRate = get(this, ['tx', 'TransferRate'], undefined);

        if (transferRate) {
            return new BigNumber(transferRate).dividedBy(1000000).minus(1000).dividedBy(10)
            .toNumber();
        }

        return undefined;
    }

    get TickSize(): number {
        return get(this, ['tx', 'TickSize'], undefined);
    }

    get WalletLocator(): string {
        return get(this, ['tx', 'WalletLocator'], undefined);
    }

    get WalletSize(): number {
        return get(this, ['tx', 'WalletSize'], undefined);
    }
}

/* Export ==================================================================== */
export default AccountSet;
