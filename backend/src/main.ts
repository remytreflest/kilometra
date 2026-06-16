import app from './app';
import { PORT } from './config/env';

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
