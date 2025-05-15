from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.contrib.auth.models import User, AnonymousUser
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.generic.list import ListView
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomerForm, ExtendedUserCreationForm
from user_management.models import News, NewsLike, Comment
from .serializers import *


from user_management.models import *
from user_management.serializers import *

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)

        try:
            new_user = User.objects.create_user(username=data['username'], password=data['password'])
        except:
            return JsonResponse({"error": "username already used."}, status=400)

        new_user.save()
        data['user'] = new_user.id

        customer_serializer = CustomerSerializer(data=data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return JsonResponse(customer_serializer.data, status=201)

        print("❌ CustomerSerializer error:", customer_serializer.errors)

        new_user.delete()
        return JsonResponse(customer_serializer.errors, status=400)

    return JsonResponse({"error": "method not allowed."}, status=405)

def signup(request):
    if request.method == 'POST':
        user_form = ExtendedUserCreationForm(request.POST)
        customer_form = CustomerForm(request.POST)
        if user_form.is_valid() and customer_form.is_valid():
            user = user_form.save()
            customer = customer_form.save(commit=False)
            customer.user = user
            customer.save()
            login(request, user)
            return redirect('home')  # เปลี่ยนเป็น URL ของหน้า Home
    else:
        user_form = ExtendedUserCreationForm()
        customer_form = CustomerForm()
    return render(request, 'signup.html', {'user_form': user_form, 'customer_form': customer_form})

from datetime import datetime

def news_detail_by_date(request, date, slug):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()  # แปลง date เป็น datetime.date
        news_item = News.objects.get(slug=slug, published_date=date_obj)
        data = {
            "title": news_item.title,
            "content": news_item.content,
            "image": news_item.image.url if news_item.image else None,
            "tags": news_item.tags,
            "additional_info": news_item.additional_info,
        }
        return JsonResponse(data, status=200)
    except News.DoesNotExist:
        return JsonResponse({"error": "News not found"}, status=404)

def news_environment(request):
    news = News.objects.filter(category__name="สิ่งแวดล้อมทางทะเล")
    data = [
        {
            "title": item.title,
            "content": item.content,
            "image": item.image.url if item.image else "",
            "slug": item.slug
        }
        for item in news
    ]
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def news_by_category(request, category_name):
    category = get_object_or_404(Category, name=category_name)
    news = News.objects.filter(category=category).order_by('-created_at')
    serializer = NewsSerializer(news, many=True, context={'request': request})
    return Response(serializer.data)

def get(self, request, date, slug):
    try:
        news = News.objects.get(slug=slug)
    except News.DoesNotExist:
        return Response({'error': 'ไม่พบข่าว'}, status=404)

    serializer = NewsSerializer(news)
    return Response(serializer.data)

class CustomerView(APIView):
   permission_classes = [IsAuthenticated]
   def get(self, request, format=None):
       customer_data = get_object_or_404(Customer, user=request.user)
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

class NewsDetailView(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()  # ดึงข้อมูลจาก slug ที่ส่งมาจาก URL
        serializer = self.get_serializer(instance, context={'request': request})
        data = serializer.data
        return Response(data)

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
    
class NewsLikeBySlugView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        news = get_object_or_404(News, slug=slug)
        like_obj, _ = NewsLike.objects.get_or_create(user=request.user, news=news)
        serializer = NewsLikeSerializer(like_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = Customer.objects.get(user=request.user)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    
class CustomerUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        customer = Customer.objects.get(user=request.user)
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class PublicProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        profile = get_object_or_404(Profile, user__username=username)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    
class SavedNewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        news = SavedNews.objects.all()
        serializer = SavedNewsSerializer(news, many=True, context={'request': request})  # เพิ่ม context
        return Response(serializer.data)
    
    def post(self, request):
        news_id = request.data.get('news_id')

        if not news_id:
            return Response({'error': 'news_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response({'error': 'ข่าวไม่พบ'}, status=status.HTTP_404_NOT_FOUND)

        # ตรวจสอบว่ามี user หรือไม่
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'กรุณาเข้าสู่ระบบก่อนบันทึกข่าว'}, status=status.HTTP_401_UNAUTHORIZED)

        # สร้าง SavedNews พร้อม user
        saved = SavedNews.objects.create(news=news, user=request.user)
        serializer = SavedNewsSerializer(saved, context={'request': request})  # เพิ่ม context
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SavedNewsDetailView(APIView):
    def delete(self, request, pk):
        try:
            saved_news = SavedNews.objects.get(pk=pk)
            saved_news.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavedNews.DoesNotExist:
            return Response({'error': 'ไม่พบข่าวที่ต้องการลบ'}, status=status.HTTP_404_NOT_FOUND)