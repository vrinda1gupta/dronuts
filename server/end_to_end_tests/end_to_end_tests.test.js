const puppeteer = require('puppeteer');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

describe('Employee end-to-end test', () => {

    let browser
    let page

    beforeEach(async () => {
        // Launch browser and wait for it to load
        browser = await puppeteer.launch(
          {
            headless: true, // headless mode set to false so browser opens up with visual feedback
          }
        );
        // Create a new page in the opened browser
        page = await browser.newPage()
    });

    afterEach(async () => {
      await page.waitFor(1000)
    })

  /*************************/
  /*     Employee Test     */
  /*************************/
  test('Employee can create a new menu item', async () => {
    /*
    * Navigate to the home page as a test
    */
    // Check that the page has properly loaded
    await page.goto('http://104.42.174.187');
    await page.waitForSelector('#DisabledMenuCheckoutButton');
    var curhtml = await page.$eval('#DisabledMenuCheckoutButton', e => e.innerHTML);
    expect(curhtml).toBe('Checkout');
    /*
    * Navigate to the employee login page and login
    */
    // Check that the page has properly loaded
    await page.goto('http://104.42.174.187/signupLogin');
    await page.waitForSelector('#LoginPageTitle');
    curhtml = await page.$eval('#LoginPageTitle', e => e.innerHTML);
    expect(curhtml).toBe('Login');

    // Enter the password in the form, submit, check to see if the correct page has loaded
    await page.waitForSelector('#employeeLoginForm');
    await page.click('input[name=password]');
    await page.type('input[name=password]', 'myNameIsJonas');
    await page.click('#loginButton');

    await page.waitForSelector('#addNewItem');
    curhtml = await page.$eval('#addNewItem', e => e.innerHTML);
    expect(curhtml).toBe('Add New Item');


    /*
    * Add a new item to the menu
    */
    // Get the existing number of Items and add one to it
    await page.waitFor(3000);
    await page.waitForSelector('#itemCount');
    curhtml = await page.$eval('#itemCount', e => e.innerHTML);
    let newItemCount = parseInt(curhtml.substr(17)) + 1;

    // Generate a unique fields to ensure tests run differently (most of the time)
    let uniqueInt = getRandomInt(17356);
    let uniqueName = "Unique Item " + uniqueInt;
    let uniqueDescription = "This was created by an automated test generating the number " + uniqueInt;
    let uniqueCalories = "" + getRandomInt(10000);
    let uniqueQuantity = "" + getRandomInt(100);
    let uniquePrice = "" + getRandomInt(20);

    // Input the generated fields
    await page.click('#addNewItem');
    await page.waitForSelector('#addEditNewItemForm');
    await page.click('input[name=newItemName]');
    await page.type('input[name=newItemName]', uniqueName);
    await page.click('input[name=newItemDescription]');
    await page.type('input[name=newItemDescription]', uniqueDescription);
    await page.click('input[name=newItemCalories]');
    await page.type('input[name=newItemCalories]', uniqueCalories);
    await page.click('input[name=newItemQuantity]');
    await page.type('input[name=newItemQuantity]', uniqueQuantity);
    await page.click('input[name=newItemPrice]');
    await page.type('input[name=newItemPrice]', uniquePrice);
    await page.click('#submitNewItemButton');

    // Check that a new item now exists
    await page.waitFor(3000);
    await page.waitForSelector('#itemCount');
    curhtml = await page.$eval('#itemCount', e => e.innerHTML);
    expect(curhtml).toBe("Number of Items: " + newItemCount);
    // Close the browser window
    browser.close()
  }, 30000);

   test('Customer can add to cart and checkout, and also look at their order', async () => {
    /*
    * Navigate to the home page as a test
    */
    await page.goto('http://104.42.174.187');
    await page.waitForSelector('#DisabledMenuCheckoutButton');
    var curhtml = await page.$eval('#DisabledMenuCheckoutButton', e => e.innerHTML);
    expect(curhtml).toBe('Checkout');

    /* add something to a cart and checkout */
    await page.click("[id='0']");
    await page.waitForSelector('#EnabledMenuCheckoutButton');
    await page.click("#EnabledMenuCheckoutButton");

    /* add in checkout details */
    await page.waitForSelector('#input-address');
    await page.click('input[name=newOrderCustomer]');
    await page.type('input[name=newOrderCustomer]', "Vrinda Gupta");
    await page.click('input[name=newOrderEmail]');
    await page.type('input[name=newOrderEmail]', "vrindag@andrew.cmu.edu");
    await page.click('input[name=newOrderPhone]');
    await page.type('input[name=newOrderPhone]', "6099550674");
    await page.click('input[name=newOrderAddress]');
    await page.type('input[name=newOrderAddress]', "101 N Dithridge St.");
    await page.click('input[name=newOrderCity]');
    await page.type('input[name=newOrderCity]', "Pittsburgh");
    await page.click('input[name=newOrderZipcode]');
    await page.type('input[name=newOrderZipcode]', "15213");
    await page.click('#checkout-button');

    /* make sure the checkout api opens */
    await page.waitFor(3 * 1000)  // wait for new page to open
    const pages = await browser.pages()  // get all pages
    expect(pages.length).toBe(2);

    await page.goto('http://104.42.174.187/order');

    await page.click('input[name=orderId]');
    await page.type('input[name=orderId]', "5e582ec56083142912959b00");
    await page.click('#orderButton');

    // Close the browser window
    browser.close();
  }, 30000);


});


