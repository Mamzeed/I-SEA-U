from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from user_management.models import *
from user_management.serializers import *
# Create your views here.

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        try:
            new_user = User.objects.create_user(username=data['username'], password=data['password'])
        except:
            return JsonResponse({"error":"username already used."}, status=400)
        new_user.save()
        data['user'] = new_user.id
        customer_serializer = CustomerSerializer(data=data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return JsonResponse(customer_serializer.data, status=201)
        new_user.delete()
        return JsonResponse({"error":"data not valid"}, status=400)
    return JsonResponse({"error":"method not allowed."}, status=405)

class CustomerView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        customer_data = Customer.objects.get(user=request.user)
        customer_serializer = CustomerSerializer(customer_data)
        content = {
            'data': customer_serializer.data
        }
        return Response(content)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# ✅ News - Anyone can access, extra info for auth users
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        news = self.get_object()
        NewsLike.objects.get_or_create(user=request.user, news=news)
        return Response({'status': 'liked'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unlike(self, request, pk=None):
        news = self.get_object()
        NewsLike.objects.filter(user=request.user, news=news).delete()
        return Response({'status': 'unliked'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        news = self.get_object()
        SavedNews.objects.get_or_create(user=request.user, news=news)
        return Response({'status': 'saved'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unsave(self, request, pk=None):
        news = self.get_object()
        SavedNews.objects.filter(user=request.user, news=news).delete()
        return Response({'status': 'unsaved'})

# ✅ SavedNews - Authenticated only
class SavedNewsViewSet(viewsets.ModelViewSet):
    serializer_class = SavedNewsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedNews.objects.filter(user=self.request.user)

# ✅ NewsLike - Authenticated only
class NewsLikeViewSet(viewsets.ModelViewSet):
    serializer_class = NewsLikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NewsLike.objects.filter(user=self.request.user)

# ✅ Comment - Authenticated only, scoped by news_pk
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(news_id=self.kwargs['news_pk'])

    def perform_create(self, serializer):
        news = get_object_or_404(News, pk=self.kwargs['news_pk'])
        serializer.save(user=self.request.user, news=news)

# ✅ ConservationActivity - Anyone can view
class ConservationActivityViewSet(viewsets.ModelViewSet):
    queryset = ConservationActivity.objects.all()
    serializer_class = ConservationActivitySerializer
    permission_classes = [AllowAny]

# ✅ ConservationMethod - Anyone can view
class ConservationMethodViewSet(viewsets.ModelViewSet):
    queryset = ConservationMethod.objects.all()
    serializer_class = ConservationMethodSerializer
    permission_classes = [AllowAny]