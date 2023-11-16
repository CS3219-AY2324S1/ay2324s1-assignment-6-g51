const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const puppeteer = require('puppeteer');

functions.http('helloHttp', async (req, res) => {
  try {
    // Make a GET request to the LeetCode API
    const response = await axios.get('https://leetcode.com/api/problems/all/');

    // Extract data from the response
    const leetCodeData = response.data;
    let questions;
    // Check if the data has the expected structure
    if (leetCodeData && leetCodeData.stat_status_pairs) {
      // Process each question in the response
      questions = leetCodeData.stat_status_pairs.map(question => {
        return {
          title: question.stat.question__title_slug,
          difficulty: question.difficulty.level,
          totalAccepted: question.stat.total_acs,
          totalSubmitted: question.stat.total_submitted,
        };
      });

    //res.status(200).send(questions[0])
    const puppeteer = require('puppeteer');

    // get the data from the leetcode question
    //const HTMLPage = await axios.get("https://leetcode.com/problems/" + questions[0].title )
    const HTMLPage = 'https://leetcode.com/problems/' + questions[0].title;
    //console.log(HTMLPage.data)
    const newPage = await getHTMLPage(HTMLPage);
    res.status(200).send(newPage)
  } else {
    console.error('Invalid data structure in the LeetCode API response');
  }
  } catch (error) {
    console.error('Error making API request:', error);
    res.status(500).send('Internal Server Error');
  }

});

async function getHTMLPage(url) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
  
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  
    // Get the HTML content after JavaScript execution
    const htmlContent = await page.content();
  
    // Close the browser
    await browser.close();
  
    return htmlContent;
  }
