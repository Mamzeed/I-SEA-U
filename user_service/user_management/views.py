from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.generic.list import ListView

from user_management.models import *
from user_management.serializers import *

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)

        required_fields = ['username', 'email', 'password', 'confirmPassword']
        if not all(field in data for field in required_fields):
            return JsonResponse({"error": "Missing required fields."}, status=400)

        if data['password'] != data['confirmPassword']:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({"error": "Username already exists."}, status=400)

        try:
            new_user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            return JsonResponse({"message": "User created successfully."}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Method not allowed."}, status=405)


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

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)

class NewsListView(ListView):
    model = News
    template_name = 'news/news_list.html'
    context_object_name = 'news_list'
    paginate_by = 5

    def get_queryset(self):
        queryset = News.objects.all().order_by('-created_at')
        category_name = self.kwargs.get('category_name')
        if category_name:
            category = get_object_or_404(Category, name=category_name)
            queryset = queryset.filter(category=category)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class NewsDetailView(APIView):
    def get(self, request, year, month, day, news_slug, format=None):
        news = get_object_or_404(
            News,
            slug=news_slug,
            created_at__year=year,
            created_at__month=month,
            created_at__day=day,
        )
        news.views += 1
        news.save()
        categories = Category.objects.all()
        context = {
            'news': news,
            'categories': categories,
        }
        return render(request, 'news/news_detail.html', context)

class NewsLikeViewSet(viewsets.ModelViewSet):
    serializer_class = NewsLikeSerializer
    permission_classes = [IsAuthenticated]
    queryset = NewsLike.objects.all()

    def get_queryset(self):
        return NewsLike.objects.filter(user=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()

    def get_queryset(self):
        return Comment.objects.filter(news_id=self.kwargs['news_pk'])

    def perform_create(self, serializer):
        news = get_object_or_404(News, pk=self.kwargs['news_pk'])
        serializer.save(user=self.request.user, news=news)

class ConservationActivityViewSet(viewsets.ModelViewSet):
    queryset = ConservationActivity.objects.all()
    serializer_class = ConservationActivitySerializer
    permission_classes = [AllowAny]

class ConservationMethodViewSet(viewsets.ModelViewSet):
    queryset = ConservationMethod.objects.all()
    serializer_class = ConservationMethodSerializer
    permission_classes = [AllowAny]