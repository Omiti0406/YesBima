import uuid
from middleware.request_context import set_request_id

class RequestTrackingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Generate unique request ID
        request_id = str(uuid.uuid4())

        # Attach to request object
        request.request_id = request_id

        # Store in thread-local context
        set_request_id(request_id)

        response = self.get_response(request)

        # Optional: add to response header
        response["X-Request-ID"] = request_id

        return response