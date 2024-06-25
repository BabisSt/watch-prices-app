const { exec } = require('child_process');

// Function to execute commands sequentially
function executeSequential(commands) {
    if (commands.length === 0) {
        console.log('All commands executed successfully.');
        return;
    }

    const command = commands.shift();
    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${command}`);
            console.error(stderr);
            return;
        }
        console.log(stdout);
        executeSequential(commands); // Recursively execute next command
    });
}

// Define commands to execute sequentially
const commands = [
    'node ../Warch_scrape.js', // Execute the scraping script
    'npm run dev', // Execute the scraping script
];

// Start executing commands sequentially
executeSequential(commands);
