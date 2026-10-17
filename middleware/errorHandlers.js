export function handleUnknownApiRoute(request, response) {
  response.status(404).json({
    error: `No API route for ${request.method} ${request.originalUrl}`,
  });
}

export function handleUnexpectedError(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }
  // Errors marked `expose` (e.g. malformed JSON bodies) are client mistakes safe to report as-is.
  if (error.expose && error.status) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Something went wrong on the server" });
}
