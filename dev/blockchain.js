const sha256 = require('sha256');
const currentNodeUrl = process.argv['3'];
function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    //Genesis Block
    this.createNewBlock(100, '0','0');

}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock = {
        index : this.chain.length + 1,
        timestamp : Date.now(),
        trasactions : this.pendingTransactions,
        nonce : nonce,
        hash : hash,
        previousBlockHash : previousBlockHash,
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
// Phuong thuc laf ham createNewBlock nay phai tra ve mot Blockmoi do la muc dich cua phuong thuc
    return newBlock
};
//Lay Block truoc do de co duoc thong so index vs previousHash cua no
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];

}
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);
// Tra transaction vua duoc tao ra ve block hien tai
    return this.getLastBlock()['index'] + 1;

}
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString()+ JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
//Ket qua cua phuong thuc la tra ra 1 hash cho Block
    return hash
}
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0,4) !== "0000"){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);  
        console.log(hash)
    };
    return nonce
}


module.exports = Blockchain;
