const test = artifacts.require("./Test")

module.exports = function(deployer){
    deployer.deploy(test)
    .then(function(){
        console.log(test)
    })
}