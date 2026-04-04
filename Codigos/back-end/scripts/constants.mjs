const SERVER_URL = "http://localhost:3001/data?";
const CLIENT_URL = "http://localhost:5500";
const SIZES = ["extra-small", "small", "medium", "large", "extra-large"];

const FORMATS = ["json", "html"];
const MINIFY_OPTIONS = [0, 1]; // 0 = pretty JSON, 1 = minified JSON (only applies to JSON format)
const GZIP_OPTIONS = [0, 1]; // 0 = no compression, 1 = gzip compression
const NUM_EXECUTIONS = 10;

const SCENARIOS = [{ order: "all-sizes", sizes: SIZES }];

export {
  CLIENT_URL,
  SERVER_URL,
  SIZES,
  FORMATS,
  MINIFY_OPTIONS,
  GZIP_OPTIONS,
  NUM_EXECUTIONS,
  SCENARIOS,
};
