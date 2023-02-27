const inquirer = require('inquirer');
const fs = require('fs');

const mergeData = [];

inquirer 
    .prompt ([
        {
            type: 'input',
            message: 'What is the Title of your Project?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Provide a description of your project.',
            name: 'description'
        },
        {
            type: 'input',
            message: 'Provide installation process.',
            name: 'installProcess'
        },
        {
            type: 'input',
            message: 'Provide usage information.',
            name: 'usage'
        },  
        {
            type: 'confirm',
            message: 'Are there any contributors?',
            name: 'contYN',
        },
    ])
    .then((data) => {

        mergeData.push(data)

        if (data.contYN || data.credits) {
            contributorLoop();
        } else {
            continuePrompts();
        };

        const contributorArray = [] 

        function contributorLoop(){
            inquirer 
            .prompt ([
                {
                    type: 'input',
                    message: 'Provide the name of a contributor with github username.',
                    name: 'credits',
                }, 
                {
                    type: 'confirm',
                    message: 'Are there any MORE contributors?',
                    name: 'addCont',
                },
            ])
            .then((data) => {
                if (data.addCont) {
                    contributorArray.push(data.credits);
                    contributorLoop();
                } else {
                    continuePrompts();
                }
            }
            )
        };

        function continuePrompts(){
        inquirer
        .prompt ([
            {
                type: 'input',
                message: 'Provide any test instructions.',
                name: 'testInst'
            },
            {
                type: 'list',
                message: 'Choose a License from the list.',
                name: 'license',
                choices: ['Apache License 2.0', 'GNU GPLv3', 'MIT', 'ISC License', 'Boost Software License 1.0']
            },
            {
                type: 'input',
                message: 'What is your Github Username?',
                name: 'github'
            },
            {
                type: 'input',
                message: 'What is your email adress?',
                name: 'email'
            },
        ])
        .then((data) => {

            mergeData.push(data);
            const fullData = {...mergeData[0], ...mergeData[1]}
            const {title, description, installProcess, usage, testInst, license, github, email} = fullData
        
            const readmeData = `
                # ${title}
        
                ![lincense Badge](https://img.shields.io/static/v1?label=license&message=${license.replaceAll(' ', '-')}&color=blue)
                ## Description
        
                ${description}
        
                ## Table of Contents
        
                - [Installation](#installation)
                - [Usage](#usage)
                - [Credits](#credits)
                - [License](#license)
        
                ## Installation
        
                ${installProcess}
        
                ## Usage
        
                ${usage}
        
                ## Credits
        
                ${contributorArray}
        
                ## Tests
        
                ${testInst}
        
                ## License
        
                ${license}
        
                ## Questions
        
                Reach out to me via either my github, or email!
        
                My Github username: [Github](https://github.com/${github})
        
                My email adress: [email](${email})`;
        
            fs.writeFile(`${title}.md`, readmeData.trim().replace(/^ +/gm, ''), (err) => err 
            ? console.log(err) 
            : console.log('Generating a README.md file...'));
            })
        }
    })