# To test locally clone the repository

1. cd getQuestions
2. npm install
3. npx functions-framework --target=helloHttp
4. test using `http://localhost:8080/`

To run the serverless function hosted by google use this url: `https://asia-southeast1-primeval-hearth-399015.cloudfunctions.net/getQuestions`

## Implementation

Currently, number of questions we get from leetcode is 100. This is because the question bank is very large, it makes it easier for tester to test.

Note that questions added by serverless function for the first time will be appended. But subsequent run will remain the same because question id is the same and thus entries will be replaced and not appended.

If user want to get the whole question bank

1. cd getQuestions
2. go to index.js
3. go to line 41
4. replace `while (i < 100) {` with `while (i < questions.length) {` NOTE: it will take long

## ALSO NOTE THAT SOME QUESTIONS ARE FOR PREMIUM LEETCODE USERS ONLY THUS YOU WILL SEE EMPTY DESCRIPTION BEING RETURNED AND WE WILL NOT ADD IT TO THE DATABASE THUS DATABASE ENTRY WILL BE LESS THAN 100
