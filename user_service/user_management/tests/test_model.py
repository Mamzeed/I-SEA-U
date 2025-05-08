from django.test import TestCase
from user_management.models import Customer
from django.contrib.auth.models import User

class CustomerTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="Test_user",
            password="12345678",
            email="john0@example.com"
        )

    def test_create_customer_true(self):
        """Customer can create correctly"""
        customer_data = {
            "fullname": "John Doe1",
            "address": "123 Main St.",
            "province": "puket",
            "post_code": "10100",
            "tel": "0999999999"
        }
        customer = Customer(user=self.user, **customer_data)
        customer.save()

        # เทียบค่าในฐานข้อมูล
        for key, value in customer_data.items():
            self.assertEqual(getattr(customer, key), value)
