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
    const data = await getHistoricalRates({
      instrument: instrument.toLowerCase(),
      dates: {
        from: new Date(from),
        to: new Date(to),
      },
      timeframe: timeframe,
      format: 'json',
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
