const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const { initializeApp } = require("firebase/app");
const { getDatabase,ref,set, remove } = require("firebase/database");

functions.http('helloHttp', async (req, res) => {
    const firebaseConfig = {
        // ...
        // The value of `databaseURL` depends on the location of the database
        databaseURL: "https://primeval-hearth-399015-default-rtdb.asia-southeast1.firebasedatabase.app/",
    };
        
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    
    // Initialize Realtime Database and get a reference to the service
    const database = getDatabase(app);
    
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
        //console.log(questions.length)
        i = 0
        while (i < 100) {

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
                    titleSlug: questions[i].title,
                },
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                },
                }
            );

            //console.log('GraphQL Response:', graphqlResponse); // Log the GraphQL response

            const content = graphqlResponse.data.data.question.content;
            const title = questions[50].title;
            //console.log(title);
            const difficultyLvl = questions[50].difficulty;
            let difficulty = null;
            if (difficultyLvl === 3) {
                difficulty = "Hard"
            } else if (difficultyLvl === 2) {
                difficulty = "Medium"
            } else {
                difficulty = "Easy"
            }

            resultQuestion = {
                title: title,
                description: content,
                difficulty: difficulty
            }
            result.push(resultQuestion);
            i++;
        }

        const rootRef = ref(database);
        remove(rootRef)
            .then(() => {
                console.log('All entries removed successfully.');
        })
            .catch((error) => {
                console.error('Error removing entries:', error);
        });
        for (let j = 0; j < result.length; j++) {
            currQn = result[j];
            currTitle = currQn.title;
            currDes = currQn.description;
            currDif = currQn.difficulty;
            
            if (currTitle && currDes && currDif) {
                writeUserData(j + 1, currTitle, currDes, currDif, database);
            }


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

function writeUserData(qnId, title, description, difficulty, db) {
    set(ref(db, 'questions/' + qnId), {
      title: title,
      description: description,
      difficulty : difficulty
    });
  }
