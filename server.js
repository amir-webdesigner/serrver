// server.js
const express = require('express');
const { getHistoricalRates } = require('dukascopy-node');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * GET /api/dukascopy
 * Query params:
 *   - instrument (e.g. 'EURUSD', lowercase accepted)
 *   - timeframe  one of: 'tick','s1','m1','m5','m15','m30','h1','h4','d1','mn1'
 *   - from       ISO date string e.g. '2024-06-01'
 *   - to         ISO date string e.g. '2024-06-30'
 */
app.get('/api/dukascopy', async (req, res) => {
  const { instrument, timeframe, from, to } = req.query;
  if (!instrument || !timeframe || !from || !to) {
    return res.status(400).json({ error: 'instrument, timeframe, from and to are required'});
  }

  try {
    const data = await getHistoricalRates({
      instrument: instrument.toLowerCase(),
      dates: {
        from: new Date(from),
        to:   new Date(to),
      },
      timeframe: timeframe,
      format:    'json',
    });
    // data is an array of [ timestamp, open, high, low, close, volume ]...
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Dukascopy proxy running on http://localhost:${PORT}`);
});
