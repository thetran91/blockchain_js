const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const uuid = require('uuid/v1');
const nodeAddress = uuid().split('-').join();
const port = process.argv[2];
const rp = require('request-promise');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin)
});
app.post('/transaction', function (req,res) {
 let blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    res.json({
        note: `That transaction will be add into Block number: ${blockIndex}`
    });
});
app.get('/mine', function(req,res) {
    let lastBlock = bitcoin.getLastBlock();
    let previousBlockHash = lastBlock['hash'];
    //lay du lieu cac transaction trong pool 
    let currentBlockData = {
        transaction: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    //lay nonce tu viec dao
    let nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    // Tao Block Hash cho block se duoc dao
    let blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    // Tao reward block cho miner
    bitcoin.createNewTransaction(12.5, "00", nodeAddress )
    // Tao ra Block moi
    let newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: 'Block was mined succesfully!',
        block: newBlock
    })

});
// Dang ki node va thong bao node moi voi toan bo node trong he thong
app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        // Push Node vao networkNode net Url cua no chua co trong network
        bitcoin.networkNodes.push(newNodeUrl);
        // Thong bao voi tat ca cac Node tron he thong co Node moi dang ki
        const regNodesPromise = [];       
        bitcoin.networkNodes.forEach((networkNodeUrl) => {
            const requestOption = {
                uri: networkNodeUrl + '/register-node',
                method: 'POST',
                body: {newNodeUrl : newNodeUrl},
                json: true
            };
        regNodesPromise.push(rp(requestOption));
        });
        // Cho khi thao tac tai lan luot cac node tien hanh xong
        Promise.all(regNodesPromise).then(data => {
            const bulkRegisterOptions = {
                uri: networkNodeUrl + '/register-node-bulk',
                method: 'POST',
                body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
                json: true
            };
            return rp(bulkRegisterOptions);
        }).then(data => {
            res.json({note: "'New node registerd with the network successfully!"})
        })
});
// He thong dong y node moi
app.post('/register-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);

    res.json({note: 'New Node is registed successfully with All Nodes '})

});
// Tra du lieu tai tat ca cac Node cho node moi
app.post('/register-node-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach((networkNodeUrl) => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
       if(nodeNotAlreadyPresent && notCurrentNode)
       bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: "Tat ca cac Node da co Url cua nhau"});
});

app.listen(port, function(){
    console.log(`Listening on port ${port}...!`)
})