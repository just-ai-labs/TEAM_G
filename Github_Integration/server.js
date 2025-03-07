import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
    const { owner, repo, days } = req.body;

    if (!owner || !repo || !days) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Install Python dependencies
    const pipInstall = spawn('pip', ['install', 'rich', 'pandas', 'openai', 'requests']);
    
    pipInstall.on('close', (code) => {
        if (code !== 0) {
            res.status(500).json({ error: 'Failed to install Python dependencies' });
            return;
        }

        const pythonProcess = spawn('python', [path.join(__dirname, 'commit_analyzer.py')]);

        // Write input data to Python process
        pythonProcess.stdin.write(JSON.stringify({ owner, repo, days }));
        pythonProcess.stdin.end();

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            console.log('Python script output:', output);
            console.log('Python script error:', error);

            if (code !== 0) {
                res.status(500).json({ error: error || 'Analysis failed' });
            } else {
                try {
                    const result = JSON.parse(output);
                    res.json(result);
                } catch (e) {
                    console.error('Failed to parse JSON:', output);
                    res.status(500).json({ error: 'Failed to parse analysis results' });
                }
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});