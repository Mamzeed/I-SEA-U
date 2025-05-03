from rest_framework import serializers
from django.contrib.auth.models import User
from user_management.models import (
    Customer, Category, News, SavedNews, 
    NewsLike, Comment, ConservationActivity, 
    ConservationMethod
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'user', 'fullname', 'address', 'province', 'post_code', 'tel')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'created_at')
        extra_kwargs = {'description': {'required': False}}

class NewsSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.SerializerMethodField(read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    comments_count = serializers.SerializerMethodField(read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)
    is_saved = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = News
        fields = (
            'id', 'title', 'content', 'image', 'category', 'author', 
            'slug', 'created_at', 'updated_at', 'views',
            'likes_count', 'comments_count', 'is_liked', 'is_saved'
        )

    def get_author(self, obj):
        return {'id': obj.author.id, 'username': obj.author.username}

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(user=request.user).exists()
        return False

class SavedNewsSerializer(serializers.ModelSerializer):
    news = NewsSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = SavedNews
        fields = ('id', 'user', 'news', 'saved_at')

class NewsLikeSerializer(serializers.ModelSerializer):
    news = NewsSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = NewsLike
        fields = ('id', 'user', 'news', 'created_at')

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    news = NewsSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'news', 'content', 'created_at', 'updated_at')

class ConservationActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConservationActivity
        fields = (
            'id', 'title', 'description', 'image', 
            'contact_info', 'location', 'start_date', 
            'end_date', 'created_at', 'updated_at'
        )

class ConservationMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConservationMethod
        fields = (
            'id', 'title', 'description', 'steps', 
            'image', 'created_at', 'updated_at'
        )