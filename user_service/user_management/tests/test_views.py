from django.test import TestCase
from django.urls import reverse
from user_management.models import News, Category, Customer
import json

class SignUpViewTestCase(TestCase):
    
    def test_signup_valid_data(self):
        """Test valid user signup"""
        data = {
            "username": "newuser",
            "password": "12345678",
            "fullname": "Test User",
            "address": "1234/12",
            "province": "Bangkok",
            "post_code": "10300",
            "tel": "123456789"
        }
        response = self.client.post(reverse('signup'), data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('home'))  # ถ้ามี view 'home'

    def test_signup_invalid_data(self):
        """Test invalid signup data"""
        response = self.client.post(reverse('signup'), {})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "This field is required")


class RegisterApiViewTestCase(TestCase):
    
    def test_register_valid_data(self):
        """Test valid registration via API"""
        data = {
            "username": "newuser",
            "password": "12345678",
            "fullname": "Test User",
            "address": "1234/12",
            "province": "Bangkok",
            "post_code": "10300",
            "tel": "123456789"
        }
        response = self.client.post(reverse('register'), 
                                    data=json.dumps(data), 
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('user', response.json())
        
    def test_register_invalid_data(self):
        """Test invalid registration via API"""
        response = self.client.post(reverse('register'), 
                                    data=json.dumps({}), 
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())


class NewsDetailViewTestCase(TestCase):

    def test_news_detail_valid(self):
        """Test news detail page with valid slug"""
        news = News.objects.create(
            title="Test News", 
            content="Test Content", 
            slug="test-news", 
            published_date="2025-05-13"
        )
        response = self.client.get(reverse('news_detail_by_date', kwargs={'date': '2025-05-13', 'slug': 'test-news'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test News")

    def test_news_detail_invalid(self):
        """Test news detail page with invalid slug"""
        response = self.client.get(reverse('news_detail_by_date', kwargs={'date': '2025-05-13', 'slug': 'not-found'}))
        self.assertEqual(response.status_code, 404)


class NewsListViewTestCase(TestCase):

    def test_news_list_category_filter(self):
        """Test news list with category filter"""
        category = Category.objects.create(name="สิ่งแวดล้อมทางทะเล")
        news = News.objects.create(
            title="Environment News", 
            content="Some content", 
            slug="env-news",
            category=category
        )
        response = self.client.get(reverse('news_by_category', kwargs={'category_name': 'สิ่งแวดล้อมทางทะเล'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Environment News")


class CustomerViewTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create_user(
            username="testuser",
            password="12345678",
            fullname="Test User",
            address="Bangkok",
            province="Bangkok",
            post_code="10300",
            tel="0123456789"
        )
        self.client.login(username="testuser", password="12345678")

    def test_customer_view(self):
        response = self.client.get(reverse('myinfo'))  # ตรงกับ path('api/myinfo/', CustomerView.as_view(), name='myinfo')
        self.assertEqual(response.status_code, 200)
        self.assertIn('fullname', response.json())


class SavedNewsListViewTestCase(TestCase):

    def test_saved_news_list(self):
        """Test GET saved news list (ต้อง login ก่อน)"""
        response = self.client.get(reverse('saved_news_list'))
        self.assertIn(response.status_code, [200, 403, 401])  # ขึ้นกับว่าต้อง auth หรือไม่

