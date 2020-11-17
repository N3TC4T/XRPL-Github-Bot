import { has, get, set, isUndefined, findKey } from 'lodash';

import BaseTransaction from './base';
import Amount from '../common/amount';

/* Types ==================================================================== */
import { LedgerTransactionType,  Destination, AmountType } from '../types';

/* Class ==================================================================== */
class EscrowFinish extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
    }

    get Amount(): AmountType {
        const affectedNodes = get(this, ['meta', 'AffectedNodes'], []);

        const finalFields = get(
            affectedNodes,
            `${findKey(affectedNodes, 'DeletedNode')}.DeletedNode.FinalFields`,
            undefined,
        );

        if (isUndefined(finalFields)) return undefined;

        return {
            currency: 'XRP',
            value: new Amount(finalFields.Amount).dropsToXrp(),
        };
    }

    get Destination(): Destination {
        const affectedNodes = get(this, ['meta', 'AffectedNodes'], []);

        const finalFields = get(
            affectedNodes,
            `${findKey(affectedNodes, 'DeletedNode')}.DeletedNode.FinalFields`,
            undefined,
        );

        if (!isUndefined(finalFields)) {
            return {
                address: finalFields.Destination,
                tag: finalFields.DestinationTag,
                name: get(this, ['tx', 'DestinationName']),
            };
        }

        return {
            address: '',
        };
    }

    get Owner(): string {
        return get(this, ['tx', 'Owner']);
    }

    set Fulfillment(fulfillment: string) {
        set(this, ['tx', 'Fulfillment'], fulfillment);
    }

    get Fulfillment(): string {
        return get(this, ['tx', 'Fulfillment']);
    }

    get Condition(): string {
        return get(this, ['tx', 'Condition']);
    }

    set OfferSequence(sequence: number) {
        set(this, ['tx', 'OfferSequence'], sequence);
    }

    get OfferSequence(): number {
        return get(this, ['tx', 'OfferSequence']);
    }
}

/* Export ==================================================================== */
export default EscrowFinish;
