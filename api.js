const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';
const OUTPUT_DIR = path.join(__dirname, 'outputs');

// Helper to run Python scripts
const runPython = (scriptName, res) => {
  const cmd = `${PYTHON_PATH} ${scriptName}`;
  console.log(`[RUN] ${cmd}`);
  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`✅ Success: ${stdout}`);
    res.json({ message: 'Success', output: stdout });
  });
};

// POST /api/download
router.post('/download', (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({ error: 'Missing YouTube URL' });

  const cmd = `yt-dlp -o "${OUTPUT_DIR}/video.mp4.webm" "${url}"`;
  console.log(`[POST] /api/download - ${cmd}`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Download error: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`✅ Downloaded: ${stdout}`);
    res.json({ message: 'Video downloaded.', path: '/outputs/video.mp4.webm' });
  });
});

// POST /api/transcribe
router.post('/transcribe', (req, res) => runPython('transcribe.py', res));

// POST /api/summarize
router.post('/summarize', (req, res) => runPython('summarize.py', res));

// POST /api/highlight
router.post('/highlight', (req, res) => runPython('highlight_meeting.py', res));

// GET /api/metadata
router.get('/metadata', (req, res) => runPython('get_metadata.py', res));

module.exports = router;