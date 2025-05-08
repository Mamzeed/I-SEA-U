from django.test import TestCase
from user_management.views import *

class RegisterView(TestCase):
  
    def test_register_customer_valid(self):
        """Customer are register correctly"""
        data = {
                "username": "john122",
                "password": "securepass",
                "email": "john0@example.com",
                "fullname": "John Doe1",
                "address": "123 Main St.",
                "province": "puket",
                "post_code": "10100",
                "tel": "0999999999"
            }
        response = self.client.post('/api/register/', content_type='application/json', data=data)
        self.assertEqual(response.status_code, 201)
        
    def test_register_customer_in_valid(self):
        """Customer are register not correctly"""
        response = self.client.post('/api/register/', content_type='application/json', data={})
        self.assertEqual(response.status_code, 400)
