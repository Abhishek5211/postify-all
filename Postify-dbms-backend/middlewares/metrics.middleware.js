const startedAt = Date.now();
const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

const httpRequestsTotal = new Map();
const httpRequestDuration = new Map();
let activeRequests = 0;

function escapeLabelValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, '\\"');
}

function labelsToText(labels) {
  const pairs = Object.entries(labels).map(
    ([key, value]) => `${key}="${escapeLabelValue(value)}"`
  );

  return pairs.length ? `{${pairs.join(",")}}` : "";
}

function increment(map, labels, amount = 1) {
  const key = JSON.stringify(labels);
  const current = map.get(key) || { labels, value: 0 };
  current.value += amount;
  map.set(key, current);
}

function getRouteLabel(req) {
  if (req.route?.path) {
    return `${req.baseUrl || ""}${req.route.path}`;
  }

  return req.baseUrl || req.path || "unknown";
}

function observeDuration(labels, durationSeconds) {
  const key = JSON.stringify(labels);
  const current =
    httpRequestDuration.get(key) ||
    {
      labels,
      buckets: defaultBuckets.map((le) => ({ le, value: 0 })),
      sum: 0,
      count: 0,
    };

  current.sum += durationSeconds;
  current.count += 1;
  for (const bucket of current.buckets) {
    if (durationSeconds <= bucket.le) {
      bucket.value += 1;
    }
  }

  httpRequestDuration.set(key, current);
}

export function metricsMiddleware(req, res, next) {
  if (req.path === "/metrics") {
    return next();
  }

  activeRequests += 1;
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    activeRequests -= 1;
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: res.statusCode,
    };

    increment(httpRequestsTotal, labels);
    observeDuration(labels, durationSeconds);
  });

  next();
}

export function renderMetrics() {
  const lines = [
    "# HELP postify_backend_info Postify backend application info.",
    "# TYPE postify_backend_info gauge",
    'postify_backend_info{service="postify-backend"} 1',
    "# HELP process_uptime_seconds Process uptime in seconds.",
    "# TYPE process_uptime_seconds gauge",
    `process_uptime_seconds ${((Date.now() - startedAt) / 1000).toFixed(3)}`,
    "# HELP process_memory_bytes Node.js process memory usage in bytes.",
    "# TYPE process_memory_bytes gauge",
  ];

  const memoryUsage = process.memoryUsage();
  for (const [type, value] of Object.entries(memoryUsage)) {
    lines.push(`process_memory_bytes${labelsToText({ type })} ${value}`);
  }

  lines.push(
    "# HELP http_requests_active Active HTTP requests.",
    "# TYPE http_requests_active gauge",
    `http_requests_active ${activeRequests}`,
    "# HELP http_requests_total Total HTTP requests.",
    "# TYPE http_requests_total counter"
  );

  for (const metric of httpRequestsTotal.values()) {
    lines.push(`http_requests_total${labelsToText(metric.labels)} ${metric.value}`);
  }

  lines.push(
    "# HELP http_request_duration_seconds HTTP request duration in seconds.",
    "# TYPE http_request_duration_seconds histogram"
  );

  for (const metric of httpRequestDuration.values()) {
    for (const bucket of metric.buckets) {
      lines.push(
        `http_request_duration_seconds_bucket${labelsToText({
          ...metric.labels,
          le: bucket.le,
        })} ${bucket.value}`
      );
    }
    lines.push(
      `http_request_duration_seconds_bucket${labelsToText({
        ...metric.labels,
        le: "+Inf",
      })} ${metric.count}`,
      `http_request_duration_seconds_sum${labelsToText(metric.labels)} ${metric.sum}`,
      `http_request_duration_seconds_count${labelsToText(metric.labels)} ${metric.count}`
    );
  }

  return `${lines.join("\n")}\n`;
}
