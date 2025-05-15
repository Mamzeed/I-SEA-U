from django.test import TestCase
from user_management.models import Customer, News, Category, SavedNews, NewsLike, Comment, Profile
from django.contrib.auth.models import User
from django.utils import timezone

class ModelsTestCase(TestCase):
    def setUp(self):
        # สร้าง User สำหรับทดสอบ
        self.user = User.objects.create_user(
            username="Test_user",
            password="12345678",
            email="john0@example.com"
        )
        # สร้าง Category สำหรับ News
        self.category = Category.objects.create(
            name="Environment",
            description="News related to environment"
        )
        # สร้าง News สำหรับทดสอบ
        self.news = News.objects.create(
            title="Conservation Effort",
            content="Details of the new conservation effort.",
            author=self.user,
            category=self.category,
            published_date=timezone.now().date()
        )
        # สร้าง Customer
        self.customer_data = {
            "fullname": "John Doe",
            "address": "123 Main St.",
            "province": "Puket",
            "post_code": "10100",
            "tel": "0999999999"
        }
        self.customer = Customer(user=self.user, **self.customer_data)
        self.customer.save()

    def test_create_customer(self):
        """ทดสอบการสร้าง Customer"""
        self.assertEqual(self.customer.fullname, "John Doe")
        self.assertEqual(self.customer.address, "123 Main St.")
        self.assertEqual(self.customer.province, "Puket")
        self.assertEqual(self.customer.post_code, "10100")
        self.assertEqual(self.customer.tel, "0999999999")
        self.assertEqual(self.customer.user.username, "Test_user")

    def test_create_news(self):
        """ทดสอบการสร้าง News"""
        self.assertEqual(self.news.title, "Conservation Effort")
        self.assertEqual(self.news.content, "Details of the new conservation effort.")
        self.assertEqual(self.news.category.name, "Environment")
        self.assertEqual(self.news.author.username, "Test_user")

    def test_save_news(self):
        """ทดสอบการสร้าง SavedNews"""
        saved_news = SavedNews(user=self.user, news=self.news)
        saved_news.save()
        self.assertEqual(saved_news.user.username, "Test_user")
        self.assertEqual(saved_news.news.title, "Conservation Effort")

    def test_like_news(self):
        """ทดสอบการสร้าง NewsLike"""
        news_like = NewsLike(user=self.user, news=self.news)
        news_like.save()
        self.assertEqual(news_like.user.username, "Test_user")
        self.assertEqual(news_like.news.title, "Conservation Effort")

    def test_create_comment(self):
        """ทดสอบการสร้าง Comment"""
        comment_data = {
            "user": self.user,
            "news": self.news,
            "content": "Great article!"
        }
        comment = Comment(**comment_data)
        comment.save()
        self.assertEqual(comment.user.username, "Test_user")
        self.assertEqual(comment.news.title, "Conservation Effort")
        self.assertEqual(comment.content, "Great article!")

    def test_create_profile(self):
        """ทดสอบการสร้าง Profile"""
        profile_data = {
            "user": self.user,
            "phone": "0999999999",
            "address": "123 Main St."
        }
        
        # ลบ Profile ที่มีอยู่แล้ว (ถ้ามี)
        Profile.objects.filter(user=self.user).delete()

        # ใช้ get_or_create เพื่อหลีกเลี่ยงการสร้าง Profile ซ้ำ
        profile, created = Profile.objects.get_or_create(user=self.user, defaults=profile_data)
        
        self.assertTrue(created)  # ตรวจสอบว่า Profile ถูกสร้างขึ้นใหม่
        self.assertEqual(profile.user.username, "Test_user")
        self.assertEqual(profile.phone, "0999999999")
        self.assertEqual(profile.address, "123 Main St.")
