const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

functions.http('helloHttp', async (req, res) => {
  try {
    // Make a GET request to the LeetCode API
    const response = await axios.get('https://leetcode.com/api/problems/all/');

    // Extract data from the response
    const leetCodeData = response.data;
    let questions;
    let result = [];
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

        i = 0
        while (i < 10) {

            // Fetch the question description for the first question
            const graphqlResponse = await axios.post(
                'https://leetcode.com/graphql/',
                {
                query: `
                    query getQuestionDetail($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            content
                        }
                    }
                `,
                variables: {
                    titleSlug: questions[50].title,
                },
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                },
                }
            );

            console.log('GraphQL Response:', graphqlResponse.data); // Log the GraphQL response

            const {content, difficulty, title,} = graphqlResponse.data.data.question;
            resultQuestion = {
                title: title,
                description: content,
                difficulty: difficulty
            }
            result.push(resultQuestion);
            i++;
        }
        res.status(200).send(result);
    } else {
      console.error('Invalid data structure in the LeetCode API response');
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('Error making API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

