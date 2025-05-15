from rest_framework import serializers
from django.contrib.auth.models import User
from user_management.models import (
    Customer, Category, News, SavedNews,
    NewsLike, Comment, ConservationActivity,
    ConservationMethod, Profile
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
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )
    author = serializers.SerializerMethodField(read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    comments_count = serializers.SerializerMethodField(read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)
    is_saved = serializers.SerializerMethodField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = News
        fields = (
            'id', 'title', 'content', 'image', 'category', 'category_id',
            'author', 'slug', 'created_at', 'updated_at', 'views',
            'likes_count', 'comments_count', 'is_liked', 'is_saved',
            'tags', 'additional_info'
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
    username = serializers.CharField(source='user.username', read_only=True)
    news_title = serializers.CharField(source='news.title', read_only=True)
    news_content = serializers.CharField(source='news.content', read_only=True)
    news_image = serializers.ImageField(source='news.image', read_only=True)
    news_slug = serializers.SlugField(source='news.slug', read_only=True)

    class Meta:
        model = SavedNews
        fields = ('id', 'username', 'news_title', 'news_content', 'news_image', 'news_slug', 'saved_at')


class NewsLikeSerializer(serializers.ModelSerializer):
    news = NewsSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = NewsLike
        fields = ('id', 'user', 'news', 'created_at')


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'news', 'content', 'created_at', 'updated_at')
        extra_kwargs = {'news': {'write_only': True}}


class ConservationActivitySerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ConservationActivity
        fields = (
            'id', 'title', 'description', 'image',
            'contact_info', 'location', 'start_date',
            'end_date', 'created_at', 'updated_at',
            'is_active'
        )

    def get_is_active(self, obj):
        from django.utils.timezone import now
        return obj.start_date <= now() <= obj.end_date


class ConservationMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConservationMethod
        fields = (
            'id', 'title', 'description', 'steps',
            'image', 'created_at', 'updated_at'
        )


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['username', 'email', 'profile_image', 'phone', 'address']

    def get_profile_image(self, obj):
        request = self.context.get('request', None)
        if request and obj.profile_image and hasattr(obj.profile_image, 'url'):
            return request.build_absolute_uri(obj.profile_image.url)
        return None
