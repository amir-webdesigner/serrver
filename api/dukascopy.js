const { getHistoricalRates } = require('dukascopy-node');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { instrument, timeframe, from, to } = req.query;
  if (!instrument || !timeframe || !from || !to) {
    return res.status(400).json({ error: 'instrument, timeframe, from and to are required' });
  }

  try {
    const now = Date.now();
    const fromDate = new Date(from);
    let toDate = new Date(to);

    // Clamp `to` if it's in the future (e.g., now + 2s or more)
    if (toDate.getTime() > now) {
      console.warn(`[Dukascopy API] Clamping 'to' time from ${toDate.toISOString()} to ${new Date(now).toISOString()}`);
      toDate = new Date(now);
    }

    const data = await getHistoricalRates({
      instrument: instrument.toLowerCase(),
      dates: {
        from: fromDate,
        to: toDate,
      },
      timeframe: timeframe,
      batchSize: 40,
      pauseBetweenBatchesMs: 500,
      format: 'json',
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
