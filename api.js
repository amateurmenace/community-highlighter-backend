const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const PYTHON_PATH = '/Users/amateurmenace/Projects/community-highlighter-backend/venv/bin/python3';

router.get('/metadata', (req, res) => {
  const cmd = `${PYTHON_PATH} get_metadata.py`;
  console.log(`[GET] /api/metadata - Running: ${cmd}`);

  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Metadata error:', stderr);
      return res.status(500).send(stderr);
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch {
      res.status(500).send('Failed to parse metadata');
    }
  });
});

router.post('/transcribe', (req, res) => {
  const cmd = `${PYTHON_PATH} transcribe.py`;
  console.log(`[POST] /api/transcribe - Running: ${cmd}`);

  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Transcription error:', stderr);
      return res.status(500).send(stderr);
    }

    res.json({
      message: 'Transcription complete.',
      path: '/outputs/subtitles.srt'
    });
  });
});

router.post('/summarize', (req, res) => {
  const cmd = `${PYTHON_PATH} summarize.py`;
  console.log(`[POST] /api/summarize - Running: ${cmd}`);

  exec(cmd, { cwd: __dirname, env: process.env }, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Summarization error:', stderr);
      return res.status(500).send(stderr);
    }

    fs.readFile('outputs/summary.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Failed to read summary:', err);
        return res.status(500).send('Summary file not found.');
      }
      res.json({ summary: data });
    });
  });
});

router.post('/highlight', (req, res) => {
  const cmd = `${PYTHON_PATH} highlight_meeting.py`;
  console.log(`[POST] /api/highlight - Running: ${cmd}`);

  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Highlight generation error:', stderr);
      return res.status(500).send(stderr);
    }

    const outputPath = 'outputs/highlight.mp4';
    if (fs.existsSync(outputPath)) {
      res.json({
        message: 'Highlight reel created.',
        path: '/outputs/highlight.mp4'
      });
    } else {
      res.status(500).send('Highlight file not found.');
    }
  });
});

module.exports = router;