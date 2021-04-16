class CustomCorsMiddleware:
    def _init_(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def _call_(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Headers"] = "*"

        # Code to be executed for each request/response after
        # the view is called.

        return response