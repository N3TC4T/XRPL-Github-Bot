import axios from "axios"
import { Application } from 'probot'

import { transactionFactory, templateFactory} from './parser'

export = ({app}: {app: Application}) => {
  app.on('issue_comment.created', async (context) => {
    let txHash;
   const commentBody = context.payload.comment.body
    const regex = new RegExp(`[A-F0-9]{64}`, 'igm')
    if(regex.test(commentBody)){
      regex.lastIndex=0
      txHash = regex.exec(commentBody)[0]
    }else{
      return ;
    }

    try{
      const resp = await axios.get(`https://hash.xrp.fans/${txHash}/json`)
      const tx = transactionFactory(resp["data"]["result"])
      const template = templateFactory(tx)

      const issueComment = context.issue({ body: template })
      await context.github.issues.createComment(issueComment)
    }catch(e) {
      console.error(e)
      return;
    }
  })
}
