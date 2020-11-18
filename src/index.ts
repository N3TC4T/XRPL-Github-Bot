import axios from "axios"
import { Application } from 'probot'

import { transactionFactory, templateFactory} from './parser'

export = ({app}: {app: Application}) => {
  app.on(['issue_comment.created', 'commit_comment.created'], async (context) => {

    const {body: commentBody} = context.payload.comment
    const {type: senderType} = context.payload.sender

    if (senderType === 'Bot' ) {
      return;
    }

    let txHash;
    const regex = new RegExp(`[A-F0-9]{64}`, 'igm')
    if(regex.test(commentBody)){
      regex.lastIndex=0
        txHash = regex.exec(commentBody)[0]
    }else{
      return ;
    }
    if(!txHash){
      return;
    }

    // fetch transaction details and parse
    let tx;
    try{
      const resp = await axios.get(`https://hash.xrp.fans/${txHash}/json`)
      tx = transactionFactory(resp["data"]["result"])
      if(!tx.Type){
        return;
      }
    }catch(e) {
      console.error("Unable fetch the transaction ", e)
      return;
    }


    // parse template
    const template = templateFactory(tx)
    if(!template){
      console.error("Unable to get template for tx type", tx.Type)
      return
    }


    // send the reply
    if(context.name === "issue_comment"){
      const issueComment = context.issue({ body: template })
      await context.github.issues.createComment(issueComment)
    }else if(context.name === "commit_comment"){
      // @ts-ignore
      const { commit_id: commit_sha} = context.payload.comment
      context.github.repos.createCommitComment({...context.repo(), commit_sha, body: template})
    }

  })
}
