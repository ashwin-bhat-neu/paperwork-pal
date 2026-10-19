const OWNER_ID_HEADER = "X-Owner-Id";

// There is no login: the browser generates this ID and the server trusts any value of this shape.
const OWNER_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

export function requireOwnerId(request, response, next) {
  const ownerId = request.get(OWNER_ID_HEADER);
  if (!ownerId || !OWNER_ID_PATTERN.test(ownerId)) {
    response
      .status(401)
      .json({ error: `Missing or invalid ${OWNER_ID_HEADER} header` });
    return;
  }
  request.ownerId = ownerId;
  next();
}

// For public routes: uses the owner ID if a valid one is sent, but never rejects the request.
export function readOwnerId(request, response, next) {
  const ownerId = request.get(OWNER_ID_HEADER);
  request.ownerId = ownerId && OWNER_ID_PATTERN.test(ownerId) ? ownerId : null;
  next();
}
