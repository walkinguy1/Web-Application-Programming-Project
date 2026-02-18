from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Anyone can register
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # is_valid() automatically checks if fields are missing or username exists
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User Created Successfully",
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)
        
        # Returns clear errors (e.g., {"username": ["This field is required."]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)