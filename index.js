const puppeteer = require("puppeteer");
const inquirer = require("inquirer")

const mainFunc = async (contractAddress, isERC, startTokenId, endTokenId) => {
    const browser = await puppeteer.launch({
        // headless: false,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );

    let arr = [];
    for (let i = startTokenId; i <= endTokenId; i++) {
        try {
            await page.goto(`https://opensea.io/assets/${!isERC ? "matic/" : ""}${contractAddress}/${i}`);
            await page.waitForSelector('[value="refresh"]');
            await page.click('[value="refresh"]');
            console.log("tokenId " + i + " finished")
            if (i % 15 === 0) {
                console.log("wait for 1 min to prevent opensea's server overload")
                await page.waitForTimeout(60000)
            }
        } catch (err) {
            console.log(err);
        }
    }
    console.log("finished. You can go")
    await browser.close();
}

const questions = [
    {
        type: 'input',
        name: 'contractAddress',
        message: 'Type contractAddress',
    },
    {
        type: 'confirm',
        name: 'isERC',
        message: 'is mainnet ?',
    },
    {
        type: 'input',
        name: 'startTokenId',
        message: 'Type startTokenId',
    },
    {
        type: 'input',
        name: 'endTokenId',
        message: 'Type endTokenId',
    },
]

inquirer
    .prompt(questions)
    .then(async (answers) => {
        const { contractAddress, isERC, startTokenId, endTokenId } = answers
        mainFunc(contractAddress, isERC, startTokenId, endTokenId)
    })
    .catch((error) => {
        if (error.isTtyError) {
        console.log(error)
        } else {
        console.log(error)
        }
    })