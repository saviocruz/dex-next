const MyERC20 = artifacts.require("MyERC20");
const SecondERC20 = artifacts.require("SecondERC20");
const Exchange = artifacts.require("Exchange");
const Pairs = artifacts.require("Pairs");
const Stacking = artifacts.require("Stacking");
const IDTToken = artifacts.require("IDTToken");

var Staker = artifacts.require("Staker");
var ERC20Factory = artifacts.require("ERC20Factory");
var MockERC20 = artifacts.require("MockERC20");

module.exports = async function (deployer) {
	const accounts = await web3.eth.getAccounts();
	const account1 = accounts[1];
	const account2 = accounts[2];
	const feeAccount = accounts[0];
	const feePercent = 10;
	let token = await deployer.deploy(MyERC20);
	let token2 = await deployer.deploy(SecondERC20);
	let idt = await deployer.deploy(IDTToken);

	let pairs = await deployer.deploy(Pairs);
	await pairs.add(token.address);
	await pairs.add(token2.address);
	await pairs.add(idt.address);

	const doacao = web3.utils.toWei("100", 'ether');
	token.transfer(account1, doacao)
	token.transfer(account2, doacao)
	let s = await token.balanceOf(feeAccount)
	console.log(s);


	await deployer.deploy(
		Stacking,
		idt.address,
		feeAccount, // Your address where you get sushi tokens - should be a multisig
		100, // Number of tokens rewarded per block, e.g., 100
		5530, // Block number when token mining starts
		100000 // Block when bonus ends

	);
	const stacking = await Stacking.deployed()
	await stacking.add(100, MyERC20.address, false)

  await idt.transferOwnership(Stacking.address)

	let exchange = await deployer.deploy(Exchange, feeAccount, feePercent);
	let amount = web3.utils.toWei("1", 'ether')

	await exchange.depositEther({ value: amount })
	let amountT = web3.utils.toWei("25", 'ether')

	await token.approve(exchange.address, amountT)
	await exchange.depositToken(token.address, amountT)

	await exchange.depositEther({ value: amount, from: account1 })
	amountT = web3.utils.toWei("18", 'ether')
	await token.approve(exchange.address, amountT, { from: account1 })
	await exchange.depositToken(token.address, amountT, { from: account1 })

	await exchange.depositEther({ value: amount, from: account2 })
	amountT = web3.utils.toWei("56", 'ether')
	await token.approve(exchange.address, amountT, { from: account2 })
	await exchange.depositToken(token.address, amountT, { from: account2 })

	const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

	enviaOrdem("3", "0.002", feeAccount)
	enviaOrdem("8", "0.0025", feeAccount)
	enviaOrdem("6", "0.0029", account1)
	enviaOrdem("1", "0.0030", account2)
	enviaOrdem("10", "0.0026", account1)

	enviaOrdemVenda("3", "0.0019", feeAccount)
	enviaOrdemVenda("4", "0.0021", account2)
	enviaOrdemVenda("2", "0.0024", feeAccount)
	enviaOrdemVenda("7", "0.0023", account1)
	enviaOrdemVenda("8", "0.0025", account2)
	enviaOrdemVenda("3", "0.0020", account1)
	enviaOrdemVenda("10", "0.0029", account2)

	await deployer.deploy(ERC20Factory);
	const erc20factory = await ERC20Factory.deployed();
	await erc20factory.createToken("Eat The Blocks", "ETB");
	await erc20factory.createToken("LP ETB-BNB", "LPToken");
	const tokens = await erc20factory.getTokens()
	console.log(tokens);
	const lpToken = await MockERC20.at(tokens[1]);
	await lpToken.mint(accounts[1], web3.utils.toWei("1000000"));
	await lpToken.mint(accounts[2], web3.utils.toWei("1000000"));


	
	depositToken = tokens[1];
	rewardToken = tokens[0];
	await deployer.deploy(Staker, depositToken, rewardToken);
	
	async function enviaOrdem(buyAmount, buyPrice, account) {
		const amountGet = web3.utils.toWei(buyAmount, 'ether');
		const tokenGive = ETHER_ADDRESS;
		const amountGive = web3.utils.toWei((buyAmount * buyPrice).toFixed(18), 'ether');
		await exchange.makeOrder(token.address, amountGet, tokenGive, amountGive, { from: account })
	}

	async function enviaOrdemVenda(buyAmount, buyPrice, account) {
		const amountGet = web3.utils.toWei(buyAmount, 'ether');
		const tokenGive = ETHER_ADDRESS;
		const amountGive = web3.utils.toWei((buyAmount * buyPrice).toFixed(18), 'ether');
		await exchange.makeOrder(tokenGive, amountGive, token.address, amountGet, { from: account })
	}
};