const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
/* TEST CREATE BLOCK
bitcoin.createNewBlock(0707, 'HJSDKSDKSLL', 'THETRAN91');
bitcoin.createNewBlock(1991, 'MINHCHITRAN', 'ABCDSDSDS');
bitcoin.createNewBlock(0707, 'HSJDSKDJSSDS', 'TOUYEN1991');
*/

/*TEST CREATE TRANSACTIONS
//Tao Block moi de dua Transaction vao
bitcoin.createNewBlock(0707, 'HJSDKSDKSLL', 'THETRAN91');
bitcoin.createNewTransaction(20, 'THETRAN', 'CHIBI');
bitcoin.createNewBlock(1234, 'UYENVU', 'THETRAN91');
bitcoin.createNewTransaction(20, 'UYENVU', 'CHIBI');
*/

/* TEST CREAT BLOCK HASH
const previousBlockHash = 'AHSDSKDSDSLDL';
const currentBlockData = [
    {
        amount: 20, 
        sender: 'THETRAN', 
        recipient: 'CHIBI'
    },
    {
        amount: 40, 
        sender: 'UYENVU', 
        recipient: 'CHIBI'
        },
];
const nonce = 100;
let hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log(hash)
*/

/* FIND NONCE AND CHECK POW
const previousBlockHash = 'AHSDSKDSDSLDL';
const currentBlockData = [
    {
        amount: 20, 
        sender: 'THETRAN', 
        recipient: 'CHIBI'
    },
    {
        amount: 40, 
        sender: 'UYENVU', 
        recipient: 'CHIBI'
        },
];
let POW = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
console.log(POW)
*/

console.log(bitcoin)

