/* eslint-disable no-lonely-if */
import { get, set, has, isUndefined, isNumber, toInteger, find } from 'lodash';

import BaseTransaction from './base';

import Amount from '../common/amount';

/* Types ==================================================================== */
import { LedgerTransactionType , LedgerAmount, Destination, AmountType } from '../types';

/* Class ==================================================================== */
class Payment extends BaseTransaction {
    [key: string]: any;

    constructor(tx?: LedgerTransactionType) {
        super(tx);
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

    // @ts-ignore
    get Amount(): AmountType {
        let amount;

        if (has(this, ['meta', 'DeliveredAmount'])) {
            amount = get(this, ['meta', 'DeliveredAmount']);
        } else {
            amount = get(this, ['meta', 'delivered_amount']);
        }

        // the delivered_amount will be unavailable in old transactions
        if (amount === 'unavailable') {
            amount = undefined;
        }

        if (!amount) {
            amount = get(this, ['tx', 'Amount']);
        }

        if (isUndefined(amount)) return undefined;

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

    get TransferRate(): number {
        return get(this, 'tx.TransferRate', 0);
    }

    get SendMax(): AmountType {
        const sendMax = get(this, ['tx', 'SendMax'], undefined);

        if (!sendMax) {
            return undefined;
        }

        if (typeof sendMax === 'string') {
            return {
                currency: 'XRP',
                value: new Amount(sendMax).dropsToXrp(),
            };
        }

        return {
            currency: sendMax.currency,
            value: sendMax.value && new Amount(sendMax.value, false).toString(),
            issuer: sendMax.issuer,
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

    get InvoiceID(): string {
        const invoiceID = get(this, 'tx.InvoiceID', undefined);

        if (!invoiceID) {
            return undefined;
        }

        return invoiceID;
    }
}

/* Export ==================================================================== */
export default Payment;
