import * as path from "path"
import fs from "fs"
import Handlebars from "handlebars"

import { get, has } from 'lodash';

import { LedgerTransactionType, TransactionJSONType } from './types';

import * as Transactions from './transactions';
import { TransactionsType } from './transactions/types';

const transactionFactory = (tx: LedgerTransactionType | TransactionJSONType): TransactionsType => {
    let passedObject = {} as LedgerTransactionType;
    let type;

    // if tx is LedgerTransactionType
    if (has(tx, 'transaction') || has(tx, 'tx')) {
        type = get(tx, ['transaction', 'TransactionType'], undefined);

        if (!type) {
            type = get(tx, ['tx', 'TransactionType'], undefined);
        }
        passedObject = tx;
    } else {
        // or TransactionJSONType
        type = get(tx, ['TransactionType'], undefined);
        passedObject = Object.assign(passedObject, { tx });
    }

    const Transaction = get(Transactions, type, Transactions.BaseTransaction);
    return new Transaction(passedObject);
};

const templateFactory = (tx: TransactionsType): string => {
    try{
        const dir  = path.join(__dirname, '..', 'templates', `${tx.Type}.html`)
        const template = fs.readFileSync(dir).toString()
        const engine = Handlebars.compile(template)
        return engine({ tx }, {allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault: true })
    }catch(e){
        console.error(e)
        return undefined
    }

}


export { transactionFactory, templateFactory } 
