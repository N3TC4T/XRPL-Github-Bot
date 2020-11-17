/**
 * Base Ledger transaction parser
 */
import { set, get, has, isUndefined } from 'lodash';

import LedgerDate from '../common/date';
import Amount from '../common/amount';
import Flag from '../common/flag';
import HexEncoding from '../common/hex';
import { txFlags } from '../common/flags/txFlags';

/* Types ==================================================================== */
import { TransactionJSONType, LedgerTransactionType ,TransactionResult, Account, Memo } from '../types';

/* Class ==================================================================== */
class BaseTransaction {
    [key: string]: any;

    constructor(_transaction?: LedgerTransactionType) {
        if (!isUndefined(_transaction)) {
            const { transaction, tx, meta } = _transaction;
            this.meta = meta;
            this.tx = transaction || tx || _transaction;
        } else {
            this.meta = {};
            this.tx = {};
        }
    }

    get Type(): string {
        return get(this, ['tx', 'TransactionType'], undefined);
    }

    set Type(type: string) {
        set(this, ['tx', 'TransactionType'], type);
    }

    get Account(): Account {
        const source = get(this, ['tx', 'Account'], undefined);
        const sourceTag = get(this, ['tx', 'SourceTag'], undefined);
        const sourceName = get(this, ['tx', 'AccountName'], undefined);

        if (isUndefined(source)) return undefined;

        return {
            name: sourceName,
            address: source,
            tag: sourceTag,
        };
    }

    get Memos(): Array<Memo> | undefined {
        const memos = get(this, ['tx', 'Memos'], undefined);

        if (isUndefined(memos)) return undefined;

        if (!Array.isArray(memos) || memos.length === 0) {
            return undefined;
        }
        return memos.map((m: any) => {
            return {
                type: m.Memo.parsed_memo_type || HexEncoding.toString(m.Memo.MemoType),
                format: m.Memo.parsed_memo_format || HexEncoding.toString(m.Memo.MemoFormat),
                data: m.Memo.parsed_memo_data || HexEncoding.toString(m.Memo.MemoData),
            };
        });
    }

    get Flags(): any {
        const intFlags = get(this, ['tx', 'Flags'], undefined);
        const flagParser = new Flag(this.Type, intFlags);
        return flagParser.parse();
    }

    set Flags(flags: any) {
        const intFlags = get(this, ['tx', 'Flags'], undefined);
        const flagParser = new Flag(this.Type, intFlags);

        flags.forEach((f: any) => {
            flagParser.set(f);
        });
        set(this, ['tx', 'Flags'], flagParser.get());
    }

    set Fee(fee: string) {
        set(this, ['tx', 'Fee'], new Amount(fee, false).xrpToDrops());
    }

    get Fee(): string {
        const fee = get(this, ['tx', 'Fee'], undefined);
        if (isUndefined(fee)) return undefined;
        return new Amount(fee).dropsToXrp();
    }

    get Date(): any {
        const date = get(this, ['tx', 'date'], undefined);
        if (isUndefined(date)) return undefined;
        const ledgerDate = new LedgerDate(date);
        return ledgerDate.toISO8601();
    }

    get TransactionResult(): TransactionResult {
        const engine_result = get(this, ['meta', 'TransactionResult']);
        const message = get(this, ['meta', 'TransactionResultMessage']);

        if (!engine_result) {
            return undefined;
        }

        return {
            success: engine_result === 'tesSUCCESS',
            code: engine_result,
            message,
        };
    }

    set TransactionResult(result: TransactionResult) {
        set(this, ['meta', 'TransactionResult'], result.code);
        set(this, ['meta', 'TransactionResultMessage'], result.message);
    }

    get Hash(): string {
        return get(this, ['tx', 'hash']);
    }

    set Hash(transactionId: string) {
        set(this, ['tx', 'hash'], transactionId);
    }

    get LedgerIndex(): number {
        return get(this, ['tx', 'ledger_index']);
    }

    // serialize transaction object to rippled tx json
    get Json(): TransactionJSONType {
        // shallow copy
        const tx = { ...this.tx };
        Object.getOwnPropertyNames(this.tx).forEach((k: string) => {
            if (!this.fields.includes(k)) {
                delete tx[k];
            }
        });

        return tx;
    }

    get Signers(): Array<any> {
        return get(this, ['tx', 'Signers'], []);
    }

    set Signers(signers: Array<any>) {
        set(this, ['tx', 'Signers'], signers);
    }

    get SigningPubKey(): string {
        return get(this, ['tx', 'SigningPubKey']);
    }

    set SigningPubKey(signingPubKey: string) {
        set(this, ['tx', 'SigningPubKey'], signingPubKey);
    }

    get Sequence(): number {
        return get(this, ['tx', 'Sequence'], undefined);
    }

    set Sequence(sequence: number) {
        set(this, ['tx', 'Sequence'], sequence);
    }

    get LastLedgerSequence(): number {
        return get(this, ['tx', 'LastLedgerSequence'], undefined);
    }

    set LastLedgerSequence(ledgerSequence: number) {
        set(this, ['tx', 'LastLedgerSequence'], ledgerSequence);
    }

    set PreviousTxnID(id: string) {
        set(this, ['tx', 'PreviousTxnID'], id);
    }

    get PreviousTxnID(): string {
        return get(this, ['tx', 'PreviousTxnID'], undefined);
    }
}

/* Export ==================================================================== */
export default BaseTransaction;
